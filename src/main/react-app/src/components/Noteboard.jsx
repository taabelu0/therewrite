import React, { useEffect, useRef, useState } from "react";
import PostIt from "./annotations/PostIt";
import '../style/annotations.scss';
import ParagraphSideBar from "./annotations/ParagraphSideBar";

function Noteboard() {
    const [creatingPostIt, setCreatingPostIt] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    const [postIts, setPostIts] = useState([]);
    const [annotations, setAnnotations] = useState([]);
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
        width.current = `${
            document.querySelector(".PdfHighlighter")?.offsetWidth
        }px`;
        height.current = `${
            document.querySelector(".PdfHighlighter")?.offsetHeight
        }px`;
    });

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

    useEffect(() => {
        document.addEventListener("keydown", addParagraphAnnotation, true);
    }, []);

    function addParagraphAnnotation() {
        let selection = window.getSelection();
        if(selection.rangeCount < 1) return;
        let scroll = { x: window.scrollX, y: window.scrollY };
        const props = {selection: selection, category: null, scroll, annotation: ParagraphSideBar};
        setAnnotations(prevAnnotations => [...prevAnnotations, props]);
    }

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

    return (
        <section
            id={"workspace"}
            style={{
                width: width.current,
                height: height.current,
            }}
        >
            <nav id="toolbar">
                <div
                    className="tool add-post-it"
                    id="add-post-it-green"
                    onClick={() => setPostItMeta("green")}
                >
                    +
                </div>
                <div
                    className="tool add-post-it"
                    id="add-post-it-yellow"
                    onClick={() => setPostItMeta("yellow")}
                >
                    +
                </div>
                <div
                    className="tool add-post-it"
                    id="add-post-it-red"
                    onClick={() => setPostItMeta("red")}
                >
                    +
                </div>
            </nav>
            <div id={"noteboard"}>
                <div id={"annotation-absolute"}>
                    <div id={"annotation-container"}>
                        {annotations.map((annotation, index) => {
                            const SpecificAnnotation = annotation.annotation;
                            return <SpecificAnnotation
                                key={`annotation_${index}`}
                                selection={annotation.selection}
                                category={annotation.category}
                                scroll={annotation.scroll}
                            />;
                        })}
                    </div>
                </div>
                <div id={"post-it-absolute"}>
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
            </div>
        </section>
    );
}

export default Noteboard;
