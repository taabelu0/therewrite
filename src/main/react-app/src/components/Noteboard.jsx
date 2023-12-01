import React, {useEffect, useRef, useState} from "react";
import PostIt from "./annotations/PostIt";
import TinyText from "./annotations/TinyText";
import '../style/annotations.scss';
import {ParagraphSideBar} from "./annotations/ParagraphSideBar";
import {ParagraphCustom} from "./annotations/ParagraphCustom";
import HighlightAnnotation from "./annotations/HighlightAnnotation";
import {annotationAPI} from "../apis/annotationAPI";
import UnderlineAnnotation from "./annotations/UnderlineAnnotation";
import {Annotation, ParagraphCustomCalc, ParagraphSideBarCalc} from "./annotations/Annotation";

const ANNOTATION_COMPONENTS = {
    'HighlightAnnotation': HighlightAnnotation,
    'TinyText': TinyText,
    'ParagraphCustom': ParagraphCustom,
    'ParagraphSideBar': ParagraphSideBar,
    'PostIt': PostIt
}; // define Annotation components here

function Noteboard({pdfName}) {
    const [creatingComponent, setCreatingComponent] = useState(null);
    const [annotations, setAnnotations] = useState([]);
    let width = useRef("100%");
    let height = useRef("100%");
    const [selectedCategory, setSelectedCategory] = useState("Definition");
    const currentCategory = useRef(selectedCategory);

    const ADDING_COMPONENT = {
        "ParagraphSideBar": addParagraphAnnotation,
        "PostIt": addPostIt,
        "TinyText": addTinyText,
        'HighlightAnnotation': addHighlightAnnotation,
        'ParagraphCustom': addParagraphCustomAnnotation,
        'Underline': addUnderlineAnnotation
    }

    useEffect(() => {
        document.addEventListener("keydown",(e) => {
            if(e.key == "ArrowUp") addParagraphAnnotation();
        }, true);
        document.addEventListener("keyup", (e) => {
            if(e.key == "ArrowDown") addParagraphCustomAnnotation();
        }, true);
    }, []);


    useEffect(() => {
        currentCategory.current = selectedCategory;
    }, [selectedCategory]);

    useEffect(() => {
        loadAnnotations();
    }, []);

    async function loadAnnotations() {
        let newAnnotations = await annotationAPI.getList(pdfName);
        setAnnotations([...newAnnotations.map(a => {
            let obj = JSON.parse(a['annotationDetail']);
            obj.id = a['idAnnotation'];
            obj.annotationText = a['annotationText'];
            return obj;
        })]);
    }

    function handleDocumentMouseDown(event) {
        if (creatingComponent !== null) {
            const {clientX, clientY} = event;
            const noteboard = document.getElementById("noteboard");
            const rect = noteboard.getBoundingClientRect();

            const x = clientX - rect.left;
            const y = clientY - rect.top;

            setTimeout(async () => {
                ADDING_COMPONENT[creatingComponent](selectedCategory, x, y);
                setCreatingComponent(null);
            }, 50);
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
        if (creatingComponent != null) {
            document.addEventListener("mouseup", handleDocumentMouseDown);
        } else {
            document.removeEventListener("mouseup", handleDocumentMouseDown);
        }

        return () => {
            document.removeEventListener("mouseup", handleDocumentMouseDown);
        };
    }, [creatingComponent, selectedCategory]);


    async function addParagraphAnnotation() {
            let selection = window.getSelection();
            if (selection.rangeCount < 1) return;
            let scroll = {x: window.scrollX, y: window.scrollY};
            let props = {
                selection: selection,
                category: currentCategory.current,
                scroll,
                annotation: "ParagraphSideBar"
            };
            ParagraphSideBarCalc(props);
            await annotationAPI.saveAnnotation(props, pdfName).then((data) => {
                props.id = data;
                setAnnotations([...annotations, props]);
            });
    }

    async function addParagraphCustomAnnotation() {
        let selection = window.getSelection();
        if (selection.rangeCount < 1) return;
        let scroll = {x: window.scrollX, y: window.scrollY};
        const props = {selection: selection, category: currentCategory.current, scroll, annotation: "ParagraphCustom"};
        ParagraphCustomCalc(props);
        await annotationAPI.saveAnnotation(props, pdfName).then((data) => {
            props.id = data;
            setAnnotations([...annotations, props]);
        });
    }

    async function addUnderlineAnnotation() {
        let selection = window.getSelection();
        if (selection.rangeCount < 1) return;
        let scroll = {x: window.scrollX, y: window.scrollY};
        const props = {selection: selection, category: null, scroll, annotation: "UnderlineAnnotation"};
        await annotationAPI.saveAnnotation(props, pdfName).then((data) => {
            props.id = data;
            setAnnotations([...annotations, props]);
        });
    }

    async function addHighlightAnnotation() {
        let selection = window.getSelection();
        if (selection.rangeCount < 1) return;
        let scroll = {x: window.scrollX, y: window.scrollY};
        const props = {
            selection: selection,
            category: currentCategory.current,
            scroll,
            annotation: "HighlightAnnotation"
        };
        await annotationAPI.saveAnnotation(props, pdfName).then((data) => {
            props.id = data;
            setAnnotations([...annotations, props]);
        });
    }


    async function addTinyText(category, x, y) {
        console.log('Im stupid');
        const newTinyText = {
            category: category,
            dataX: x,
            dataY: y,
            text: "",
            annotation: "TinyText"
        };
        await annotationAPI.saveAnnotation(newTinyText, pdfName).then((data) => {
            newTinyText.id = data;
            setAnnotations([...annotations, newTinyText]);
        });
    }

    async function addPostIt(category, x, y) {
        const newPostIt = {
            color: "green",
            dataX: x,
            dataY: y,
            text: "",
            annotation: "PostIt"
        };
        await annotationAPI.saveAnnotation(newPostIt, pdfName).then((data) => {
            newPostIt.id = data;
            setAnnotations([...annotations, newPostIt]);
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
                        onClick={() => setCreatingComponent("HighlightAnnotation")}
                    >
                        h
                    </div>
                    <div
                        className="tool add-post-it"
                        id="add-post-it-yellow"
                        onClick={() => setCreatingComponent("ParagraphSideBar")}
                    >
                        p
                    </div>
                    <div
                        className="tool add-post-it"
                        id="add-post-it-red"
                        onClick={() => setCreatingComponent("ParagraphCustom")}
                    >
                        c
                    </div>
                    <div
                        className="tool add-post-it"
                        id="add-post-it-red"
                        onClick={() => setCreatingComponent("Underline")}
                    >
                        u
                    </div>
                    <div
                        className="tool add-post-it"
                        id="add-post-it-red"
                        onClick={() => setCreatingComponent("PostIt")}
                    >
                        P
                    </div>
                    <div
                        className="tool add-post-it"
                        id="add-post-it-red"
                        onClick={() => setCreatingComponent("TinyText")}
                    >
                        T
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
                            if (annotation.annotation) {
                                const SpecificAnnotation = ANNOTATION_COMPONENTS[annotation.annotation] || Annotation;
                               return <SpecificAnnotation
                                    id={annotation.id}
                                    key={`annotation_${index}`}
                                    selection={annotation.selection}
                                    category={annotation.category}
                                    scroll={annotation.scroll}
                                    text={annotation.annotationText}
                                    color={annotation.color}
                                    dataX={annotation.dataX}
                                    dataY={annotation.dataY}
                                    top={annotation.top}
                                    left={annotation.left}
                                    width={annotation.width}
                                    height={annotation.height}
                                    scollX={annotation.scrollX}
                                    scrollY={annotation.scrollY}
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
