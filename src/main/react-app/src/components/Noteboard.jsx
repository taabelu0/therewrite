import React, { useEffect, useRef, useState } from "react";
import PostIt from "./annotations/PostIt";
import '../style/annotations.scss';
import ParagraphSideBar from "./annotations/ParagraphSideBar";
import ParagraphCustom from "./annotations/ParagraphCustom";
import HighlightAnnotation from "./annotations/HighlightAnnotation";
import {annotationAPI} from "../apis/annotationAPI";
import Annotation from "./annotations/Annotation";
const ANNOTATION_COMPONENTS = {'ParagraphSideBar': ParagraphSideBar, 'PostIt': PostIt}; // define Annotation components here

function Noteboard( {highlight} ) {
    const [creatingPostIt, setCreatingPostIt] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    const [annotations, setAnnotations] = useState([]);
    let width = useRef("100%");
    let height = useRef("100%");
    const [selectedCategory, setSelectedCategory] = useState("Definition");

    useEffect(() => {
        loadAnnotations();
    }, []);

    async function loadAnnotations() {
        let newAnnotations = await annotationAPI.getList();
        setAnnotations([...newAnnotations.map(a => JSON.parse(a['annotationDetail']))]);
    }

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
        document.addEventListener("keydown", addParagraphCustomAnnotation, true);
    }, []);

    function addParagraphAnnotation() {
        let selection = window.getSelection();
        if (selection.rangeCount < 1) return;
        let scroll = {x: window.scrollX, y: window.scrollY};
        const props = {selection: selection, category: null, scroll, annotation: "ParagraphSideBar"};
        setAnnotations(prevAnnotations => [...prevAnnotations, props]);
    }

    function addParagraphCustomAnnotation() {
        let selection = window.getSelection();
        if(selection.rangeCount < 1) return;
        let scroll = { x: window.scrollX, y: window.scrollY };
        const props = {selection: selection, category: null, scroll, annotation: ParagraphCustom};
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


    function addPostIt(color, x, y) {
        const newPostIt = {
            color: color,
            dataX: x,
            dataY: y,
            text: "",
            annotation: "PostIt"
        };
        annotationAPI.savePostItPositionToDatabase(newPostIt).then((data) => {
            newPostIt.id = data;
            setAnnotations([...annotations, newPostIt]);
        });
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
                            className={selectedCategory === cat ? `category category-${cat.toLowerCase()} category-active` : `category category-${cat.toLowerCase()}`}
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
                            if (annotation.annotation) {
                                const SpecificAnnotation = ANNOTATION_COMPONENTS[annotation.annotation] || Annotation;
                                return <SpecificAnnotation
                                    id={annotation.id}
                                    key={`annotation_${index}`}
                                    selection={annotation.selection}
                                    category={annotation.category}
                                    scroll={annotation.scroll}
                                    text={annotation.text}
                                    color={annotation.color}
                                    dataX={annotation.dataX}
                                    dataY={annotation.dataY}
                                />;
                            } else return null;
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Noteboard;
