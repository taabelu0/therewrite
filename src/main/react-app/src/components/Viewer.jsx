import React, {Component, useEffect} from "react";

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

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const searchParams = new URLSearchParams(document.location.search);

let initialUrl = "http://localhost:8080/pdf/get/gobook.pdf";
class App extends Component<> {

    state = {
        url: initialUrl,
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

export default App;