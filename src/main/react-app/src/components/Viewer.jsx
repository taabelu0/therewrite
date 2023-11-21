import React, {Component, useEffect, useRef, useState} from "react";
import {
    PdfLoader,
    PdfHighlighter,
    Tip,
    Highlight,
    Popup,
    AreaHighlight,
} from "react-pdf-highlighter";
import '../style/basic.css';
import '../style/list.css';
import '../style/viewer.scss';
import '../style/react-viewer.scss';
import { IHighlight, NewHighlight } from "react-pdf-highlighter";
import {useParams} from "react-router-dom";
import PostIt from "./annotations/PostIt";
import ReactDOM from "react-dom/client";


const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
    document.location.hash.slice("#highlight-".length);

const resetHash = () => {
    document.location.hash = "";
};

const HighlightPopup = ({
                            comment,
                        }) =>
    comment.text ? (
        <div className="Highlight__popup">
            {comment.emoji} {comment.text}
        </div>
    ) : null;

const BASE_URL = 'http://localhost:8080';
const initialUrl = {"url": ""};
let isReady = false;


function PDFViewer() {
    let {pdfName} = useParams();
    initialUrl.url = BASE_URL + "/pdf/get/" + pdfName;
    return (
        <div>
            <Core></Core>
            <Noteboard></Noteboard>
        </div>
    );
}

function Noteboard() {
    const [creatingPostIt, setCreatingPostIt] = useState(false);
    const [selectedColor, setSelectedColor] = useState("green");
    const [postIts, setPostIts] = useState([]);

    let width = useRef("100%");
    let height = useRef("100%");

    function handleDocumentMouseDown(event) {
        if (creatingPostIt) {
            const { clientX, clientY } = event;
            const noteboard = document.getElementById("noteboard");
            const rect = noteboard.getBoundingClientRect();

            const x = clientX - rect.left;
            const y = clientY - rect.top;

            addPostIt(selectedColor, x, y);

            setCreatingPostIt(false);
        }
    }

    useEffect(() => {
        width.current = `${document.querySelector(".PdfHighlighter")?.offsetWidth}px`;
        height.current = `${document.querySelector(".PdfHighlighter")?.offsetHeight}px`;
    })


    useEffect(() => {
        if (creatingPostIt) {
            document.addEventListener("mousedown", handleDocumentMouseDown);
        } else {
            document.removeEventListener("mousedown", handleDocumentMouseDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleDocumentMouseDown);
        };
    }, [creatingPostIt, selectedColor]);


    function addPostIt(color, x, y) {
        const newPostIt = {
            color: color,
            dataX: x,
            dataY: y,
            text: "",
        };

        setPostIts([...postIts, newPostIt]);
    }

    function setPostItMeta(color) {
        setSelectedColor(color);
        setCreatingPostIt(true);
    }

    return(
        <section id={"workspace"} style={{
            width: width.current,
            height: height.current
        }}>
            <nav id="toolbar">
                <div className="tool add-post-it" id="add-post-it-green" onClick={() => setPostItMeta("green")}>+</div>
                <div className="tool add-post-it" id="add-post-it-yellow" onClick={() => setPostItMeta("yellow")}>+</div>
                <div className="tool add-post-it" id="add-post-it-red" onClick={() => setPostItMeta("red")}>+</div>
            </nav>
            <div id={"noteboard"}>
                <div className={"post-it-wrapper"}>
                    {postIts.map((postIt, index) => (
                        <PostIt
                            key={`postIt_${index}`}
                            color={postIt.color}
                            text={postIt.text}
                            dataX={postIt.dataX}
                            dataY={postIt.dataY}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

class Core extends Component<> {

    state = {
        url: initialUrl.url,
        highlights: [],
    };

    resetHighlights = () => {
        this.setState({
            highlights: [],
        });
    };

    scrollViewerTo = (highlight) => {};

    scrollToHighlightFromHash = () => {
        const highlight = this.getHighlightById(parseIdFromHash());

        if (highlight) {
            this.scrollViewerTo(highlight);
        }
    };

    componentDidMount() {
        window.addEventListener(
            "hashchange",
            this.scrollToHighlightFromHash,
            false
        );
    }

    getHighlightById(id) {
        const { highlights } = this.state;

        return highlights.find((highlight) => highlight.id === id);
    }

    addHighlight(highlight) {
        const { highlights } = this.state;

        console.log("Saving highlight", highlight);

        this.setState({
            highlights: [{ ...highlight, id: getNextId() }, ...highlights],
        });
    }

    updateHighlight(highlightId, position, content) {
        console.log("Updating highlight", highlightId, position, content);

        this.setState({
            highlights: this.state.highlights.map((h) => {
                const {
                    id,
                    position: originalPosition,
                    content: originalContent,
                    ...rest
                } = h;
                return id === highlightId
                    ? {
                        id,
                        position: { ...originalPosition, ...position },
                        content: { ...originalContent, ...content },
                        ...rest,
                    }
                    : h;
            }),
        });
    }

    render() {
        const { url, highlights } = this.state;
        return (
                    <PdfLoader url={url} beforeLoad={()=>{}}>
                        {(pdfDocument) => (
                            <PdfHighlighter
                                pdfDocument={pdfDocument}
                                enableAreaSelection={(event) => event.altKey}
                                onScrollChange={resetHash}
                                pdfScaleValue={1.39}
                                scrollRef={(scrollTo) => {
                                    this.scrollViewerTo = scrollTo;

                                    this.scrollToHighlightFromHash();
                                }}
                                onSelectionFinished={(
                                    position,
                                    content,
                                    hideTipAndSelection,
                                    transformSelection
                                ) => (
                                    <Tip
                                        onOpen={transformSelection}
                                        onConfirm={(comment) => {
                                            this.addHighlight({ content, position, comment });

                                            hideTipAndSelection();
                                        }}
                                    />
                                )}
                                highlightTransform={(
                                    highlight,
                                    index,
                                    setTip,
                                    hideTip,
                                    viewportToScaled,
                                    screenshot,
                                    isScrolledTo
                                ) => {
                                    const isTextHighlight = !Boolean(
                                        highlight.content && highlight.content.image
                                    );

                                    const component = isTextHighlight ? (
                                        <Highlight
                                            isScrolledTo={isScrolledTo}
                                            position={highlight.position}
                                            comment={highlight.comment}
                                        />
                                    ) : (
                                        <AreaHighlight
                                            isScrolledTo={isScrolledTo}
                                            highlight={highlight}
                                            onChange={(boundingRect) => {
                                                this.updateHighlight(
                                                    highlight.id,
                                                    { boundingRect: viewportToScaled(boundingRect) },
                                                    { image: screenshot(boundingRect) }
                                                );
                                            }}
                                        />
                                    );

                                    return (
                                        <Popup
                                            popupContent={<HighlightPopup {...highlight} />}
                                            onMouseOver={(popupContent) =>
                                                setTip(highlight, (highlight) => popupContent)
                                            }
                                            onMouseOut={hideTip}
                                            key={index}
                                            children={component}
                                        />
                                    );
                                }}
                                highlights={highlights}
                            />
                        )}
                    </PdfLoader>
        );
    }
}

export default PDFViewer;