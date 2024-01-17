import React, {useEffect, useRef, useState} from "react";
import PostIt from "./annotations/PostIt";
import TinyText from "./annotations/TinyText";
import '../style/annotations.scss';
import {ParagraphSideBar, ParagraphSideBarCalc} from "./annotations/ParagraphSideBar";
import {ParagraphCustom, ParagraphCustomCalc} from "./annotations/ParagraphCustom";
import {HighlightAnnotation} from "./annotations/HighlightAnnotation";
import {annotationAPI} from "../apis/annotationAPI";
import {UnderlineAnnotation} from "./annotations/UnderlineAnnotation";
import {Annotation, BoundingBoxCalc} from "./annotations/Annotation";
import * as StompJs from "@stomp/stompjs";

const ANNOTATION_COMPONENTS = {
    'HighlightAnnotation': HighlightAnnotation,
    'UnderlineAnnotation': UnderlineAnnotation,
    'TinyText': TinyText,
    'ParagraphCustom': ParagraphCustom,
    'ParagraphSideBar': ParagraphSideBar,
    'PostIt': PostIt,
    'Underline': UnderlineAnnotation
}; // define Annotation components here

let stompClient = new StompJs.Client({brokerURL: 'ws://localhost:8080/ws'})

function Noteboard({pdfName}) {
    const [creatingComponent, setCreatingComponent] = useState(null);
    const [annotations, setAnnotations] = useState({});
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
        'UnderlineAnnotation': addUnderlineAnnotation
    }

    useEffect(() => {
        currentCategory.current = selectedCategory;
    }, [selectedCategory]);

    useEffect(() => {
        initiateStompWS(pdfName);
        loadAnnotations();
    }, []);

    function applyAnnotationChanges(msgAnnotation) {
        if (!msgAnnotation) {
            console.error('Annotation in message is null or undefined:', msgAnnotation);
            return;
        }
        let patchAnnotation = JSON.parse(msgAnnotation['annotationDetail']);
        patchAnnotation.id = msgAnnotation.idAnnotation;
        setAnnotations(prevAnnotations => {
            return {...prevAnnotations, ...{[patchAnnotation.id]: patchAnnotation}}
        });
    }

    function initiateStompWS(pdfName) {
        stompClient.onConnect = (frame) => {
            console.log('Connection: ' + frame);
            stompClient.subscribe(`/session/${pdfName}`, (message) => {
                let msgAnnotation = JSON.parse(message.body).message;
                applyAnnotationChanges(msgAnnotation);
            });
        };

        stompClient.onWebSocketError = (error) => {
            console.error('Error with websocket', error);
        };

        stompClient.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        stompClient.activate();
    }

    async function loadAnnotations() {
        let newAnnotations = await annotationAPI.getList(pdfName);
        let newAnnotationsObj = {};
        newAnnotations.map(a => {
            let obj = JSON.parse(a['annotationDetail']);
            obj.id = a['idAnnotation'];
            newAnnotationsObj[a['idAnnotation']] = obj;
        });
        setAnnotations(newAnnotationsObj);
    }

    function sendMessage(anno) {
        stompClient.publish({
            destination: `/app/${pdfName}`,
            body: JSON.stringify({"message": anno})
        });
    }

    function handleDocumentMouseDown(event) {
        if (creatingComponent !== null) {
            createAnnotation(event);
        }
    }

    function createAnnotation(event) {
        const {clientX, clientY} = event;
        const noteboard = document.getElementById("noteboard");
        const rect = noteboard.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        setTimeout(async () => {
            let newAnno = await ADDING_COMPONENT[creatingComponent](selectedCategory, x, y);
            sendMessage(newAnno); // notifies websocket
            setCreatingComponent(null);
        }, 50);
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
        let props = {
            selection: selection,
            category: currentCategory.current,
            annotation: "ParagraphSideBar"
        };
        ParagraphSideBarCalc(props);
        return await annotationAPI.saveAnnotation(props, pdfName).then((data) => {
            props.id = data.idAnnotation;
            setAnnotations({...annotations, [props['id']]: props});
            return data;
        });
    }

    async function addParagraphCustomAnnotation() {
        let selection = window.getSelection();
        if (selection.rangeCount < 1) return;
        const props = {selection: selection, category: currentCategory.current, annotation: "ParagraphCustom"};
        ParagraphCustomCalc(props);
        return await annotationAPI.saveAnnotation(props, pdfName).then((data) => {
            props.id = data.idAnnotation;
            setAnnotations({...annotations, [props['id']]: props});
            return data;
        });
    }

    async function addUnderlineAnnotation() {
        console.log("add underline");
        let selection = window.getSelection();
        if (selection.rangeCount < 1) return;
        const props = {
            selection: selection,
            category: currentCategory.current,
            annotation: "UnderlineAnnotation"
        };
        BoundingBoxCalc(props);
        return await annotationAPI.saveAnnotation(props, pdfName).then((data) => {
            props.id = data.idAnnotation;
            setAnnotations({...annotations, [props['id']]: props});
            return data
        });
    }

    async function addHighlightAnnotation() {
        let selection = window.getSelection();
        if (selection.rangeCount < 1) return;
        const props = {
            selection: selection,
            category: currentCategory.current,
            annotation: "HighlightAnnotation"
        };
        BoundingBoxCalc(props);
        return await annotationAPI.saveAnnotation(props, pdfName).then((data) => {
            props.id = data.idAnnotation;
            setAnnotations({...annotations, [props['id']]: props});
            return data;
        });
    }


    async function addTinyText(category, x, y) {
        const newTinyText = {
            category: category,
            dataX: x,
            dataY: y,
            text: "",
            annotation: "TinyText"
        };
        return await annotationAPI.saveAnnotation(newTinyText, pdfName).then((data) => {
            newTinyText.id = data.idAnnotation.idAnnotation;
            setAnnotations({...annotations, [newTinyText['id']]: newTinyText});
            return data;
        });
    }

    async function addPostIt(category, x, y) {
        const newPostIt = {
            category: category,
            dataX: x,
            dataY: y,
            text: "",
            annotation: "PostIt"
        };
        return await annotationAPI.saveAnnotation(newPostIt, pdfName).then((data) => {
            newPostIt.id = data.idAnnotation;
            setAnnotations({...annotations, [newPostIt['id']]: newPostIt});
            return data;
        });
    }

    function onAnnotationChange(annotation) {
        sendMessage(annotation);
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
                        className={`tool add-post-it ${creatingComponent === "HighlightAnnotation" ? "add-tool-active" : ""}`}
                        id="add-post-it-green"
                        onClick={() => setCreatingComponent("HighlightAnnotation")}
                    >
                        ✎
                    </div>
                    <div
                        className={`tool add-post-it ${creatingComponent === "ParagraphCustom" ? "add-tool-active" : ""}`}
                        onClick={() => setCreatingComponent("ParagraphCustom")}
                    >
                        🖌
                    </div>
                    <div
                        className={`tool add-post-it ${creatingComponent === "ParagraphSideBar" ? "add-tool-active" : ""}`}
                        onClick={() => setCreatingComponent("ParagraphSideBar")}
                    >
                        |
                    </div>
                    <div
                        className={`tool add-post-it ${creatingComponent === "UnderlineAnnotation" ? "add-tool-active" : ""}`}
                        onClick={() => setCreatingComponent("UnderlineAnnotation")}
                    >
                        ⎁
                    </div>
                    <div
                        className={`tool add-post-it ${creatingComponent === "PostIt" ? "add-tool-active" : ""}`}
                        onClick={() => setCreatingComponent("PostIt")}
                    >
                        🗅
                    </div>
                    <div
                        className={`tool add-post-it ${creatingComponent === "TinyText" ? "add-tool-active" : ""}`}
                        id="add-post-it-yellow"
                        onClick={() => setCreatingComponent("TinyText")}
                    >
                        Ƭ
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
                        {Object.keys(annotations).map(key => {
                            let annotation = annotations[key];
                            if (annotation.annotation) {
                                const SpecificAnnotation = ANNOTATION_COMPONENTS[annotation.annotation] || Annotation;
                                return <SpecificAnnotation
                                    annotation={annotation}
                                    key={annotation.id}
                                    onChange={onAnnotationChange}
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
