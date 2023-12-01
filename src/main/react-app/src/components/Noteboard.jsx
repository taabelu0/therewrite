import React, { useEffect, useRef, useState } from "react";
import PostIt from "./annotations/PostIt";
import TinyText from "./annotations/TinyText";
import '../style/annotations.scss';
import ParagraphSideBar from "./annotations/ParagraphSideBar";
import HighlightAnnotation from "./annotations/HighlightAnnotation";
import {annotationAPI} from "../apis/annotationAPI";

function Noteboard( { pdfName }) {
    const [creatingPostIt, setCreatingPostIt] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    const [postIts, setPostIts] = useState([]);
    const [annotations, setAnnotations] = useState([]);
    let width = useRef("100%");
    let height = useRef("100%");

    //ONLOAD:
    useEffect(() => {
       loadAnnotations();
    }, []);

    async function loadAnnotations() {
        let newAnnotations = await annotationAPI.getList(pdfName);
        console.log("ANNOTATION", newAnnotations, typeof newAnnotations)
        setPostIts([...newAnnotations.map(a => {
            let obj = JSON.parse(a['annotationDetail']);
            obj.id = a['idAnnotation'];
            obj.annotationText = a['annotationText'];
            return obj;
        })]);
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
        document.addEventListener("keydown", addParagraphAnnotation, true);
    }, []);

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


    function addTinyText(category, x, y) {
        const newTinyText = {
            category: category,
            dataX: x,
            dataY: y,
            text: "",
        };
        setTinyTexts([...tinyTexts, newTinyText]);
    }

   async function addPostIt(category, x, y) {
        const newPostIt = {
            color: color,
            dataX: x,
            dataY: y,
            text: "",
        };
        await annotationAPI.savePostItPositionToDatabase(newPostIt, pdfName).then((data) => {
            newPostIt.id = data;
            console.log("NEW POSTIT ID", newPostIt.id)
            setPostIts([...postIts, newPostIt]);
        });
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
                        onClick={() => {setAddingElement(ADDING_STATUS.TINYTEXT)}}
                    >
                        +
                    </div>
                    <div
                        className="tool add-post-it"
                        id="add-post-it-yellow"
                        onClick={() => {setAddingElement(ADDING_STATUS.POSTIT)}}
                    >
                        +
                    </div>
                    <div
                        className="tool add-post-it"
                        id="add-post-it-red"
                        onClick={() => {setAddingElement(ADDING_STATUS.EMPTY)}}
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
                                id={postIt.id}
                                color={postIt.color}
                                text={postIt.annotationText}
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
