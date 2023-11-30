import React, { useEffect, useRef, useState } from "react";
import PostIt from "./annotations/PostIt";
import TinyText from "./annotations/TinyText";
import '../style/annotations.scss';
import ParagraphSideBar from "./annotations/ParagraphSideBar";
import HighlightAnnotation from "./annotations/HighlightAnnotation";

function Noteboard( {highlight} ) {
    const [creatingPostIt, setCreatingPostIt] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    const [postIts, setPostIts] = useState([]);
    const [tinyTexts, setTinyTexts] = useState([]);
    const [annotations, setAnnotations] = useState([]);
    let width = useRef("100%");
    let height = useRef("100%");
    const [selectedCategory, setSelectedCategory] = useState("Definition");

    function handleDocumentMouseDown(event) {
        if (creatingPostIt) {
            const { clientX, clientY } = event;
            const noteboard = document.getElementById("noteboard");
            const rect = noteboard.getBoundingClientRect();

            const x = clientX - rect.left;
            const y = clientY - rect.top;

            addTinyText(selectedColor, x, y);
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


    function addParagraphAnnotation() {
        let selection = window.getSelection();
        if(selection.rangeCount < 1) return;
        let scroll = { x: window.scrollX, y: window.scrollY };
        const props = {selection: selection, category: null, scroll, annotation: ParagraphSideBar};
        setAnnotations(prevAnnotations => [...prevAnnotations, props]);
    }

    useEffect(() => {
        addHighlightAnnotation();
    }, [highlight]);

    const addHighlightAnnotation = () => {
        console.log("Adding highlight annotation:", highlight);
        let selection = window.getSelection();
        if(selection.rangeCount < 1) return;
        let scroll = { x: window.scrollX, y: window.scrollY };
        const props = {selection: selection, category: null, scroll, annotation: HighlightAnnotation};

        setAnnotations(prevAnnotations => [...prevAnnotations, props]);
    };


    function addTinyText(color, x, y) {
        const newTinyText = {
            category: selectedCategory,
            dataX: x,
            dataY: y,
            text: "",
        };
        setTinyTexts([...tinyTexts, newTinyText]);
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
            <nav id="sidebar">
                <div id="toolbar">
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
                </div>
                <div id="category-selection">
                    {["Definition", "Explosion", "Deletion", "Correction", "Speculation", "Addition"].map((cat, key) => (
                        <div
                            className={`category category-${cat.toLowerCase()} ${selectedCategory === cat ? "category-active" : ""}`}
                            key={key}
                            onClick={() => setSelectedCategory(`${cat}`)}
                        >
                            <div className="category-ball"></div>
                            <div>{cat}</div>
                        </div>
                    ))}
                </div>
            </nav>
            <div id={"noteboard"}>
                <div id={"annotation-absolute"}>
                    <div id={"annotation-container"}>
                        {annotations.map((annotation, index) => {
                            let SpecificAnnotation = annotation.annotation;
                            return (
                                <SpecificAnnotation
                                    key={`annotation_${index}`}
                                    selection={annotation.selection}
                                    category={annotation.category}
                                    scroll={annotation.scroll}
                                />
                            );
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
                        {tinyTexts.map((tinyText, index) => (
                            <TinyText
                                key={`tinyText_${index}`}
                                category={tinyText.category}
                                text={tinyText.text}
                                dataX={tinyText.dataX}
                                dataY={tinyText.dataY}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Noteboard;
