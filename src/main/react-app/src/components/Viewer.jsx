import React, {Component, useEffect, useRef, useState} from "react";
import {
    PdfLoader,
    PdfHighlighter
} from "react-pdf-highlighter";
import '../style/basic.scss';
import '../style/list.scss';
import '../style/viewer.scss';
import '../style/react-viewer.scss';
import {useParams} from "react-router-dom";
import Noteboard from "./Noteboard";
import {pdfAPI} from "../apis/pdfAPI";


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

const initialUrl = {"url": ""};



function PDFViewer() {
    let { pdfName } = useParams();
    initialUrl.url = pdfAPI.getUrl(pdfName);
    const [globalSelection, setGlobalSelection] = useState({});

    const notifyNoteboard = (selection) => {
        setGlobalSelection(selection);
    }

    return (
        <div>
            <Core notifyNoteboard={notifyNoteboard}></Core>
            <Noteboard pdfID={pdfName} globalSelection={globalSelection}
            ></Noteboard>
        </div>
    );
}

class Core extends Component<> {
    constructor(props) {
        super(props);
        this.state.notifyNoteboard = props.notifyNoteboard;
    }

    state = {
        url: initialUrl.url,
        highlights: [],
        notifyNoteboard: () => {}
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
        const { url } = this.state;
        return (
            <PdfLoader url={url} beforeLoad={()=>{}}>
                {(pdfDocument) => (
                    <PdfHighlighter
                        pdfDocument={pdfDocument}
                        onScrollChange={resetHash}
                        enableAreaSelection={(event) => null}
                        onSelectionFinished={(
                            position,
                            content,
                            hideTipAndSelection,
                            transformSelection
                        ) => {
                            this.state.notifyNoteboard(position);
                        }}
                        pdfScaleValue={1.39}
                        scrollRef={(scrollTo) => {
                            this.scrollViewerTo = scrollTo;
                            this.scrollToHighlightFromHash();
                        }}
                        highlights={[]}
                    />
                )}
            </PdfLoader>
        );
    }
}

export default PDFViewer;