import React, {useEffect, useRef, useState} from "react";
import PostIt from "./annotations/PostIt";
import TinyText from "./annotations/TinyText";
import CommentBox from './CommentBox';
import SidebarAnnotation from "./annotations/SidebarAnnotation";
import '../style/annotations.scss';
import '../style/sidebar.scss';
import '../style/addAnnotation.scss';
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
    'PostIt': PostIt
}; // define Annotation components here

let stompClient = new StompJs.Client({brokerURL: 'ws://localhost:8080/ws'})

function Noteboard({pdfName}) {
    const [creatingComponent, setCreatingComponent] = useState(null);
    const [annotations, setAnnotations] = useState({});
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [tempHighlight, setTempHighlight] = useState(null); // contains database annotation object and not front-end object
    const [showSidebar, setShowSidebar] = useState(false);
    const [annotationCoordinates, setAnnotationCoordinates] = useState({ x: 0, y: 0 });
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

    useEffect(() => {
        setShowCommentBox(tempHighlight != null);
    }, [tempHighlight]);

    function applyAnnotationChanges(msgAnnotation) {
        if (!msgAnnotation) {
            console.error('Annotation in message is null or undefined:', msgAnnotation);
            return;
        }
        let patchAnnotation = JSON.parse(msgAnnotation['annotationDetail']);
        patchAnnotation.id = msgAnnotation.idAnnotation;
        patchAnnotation.text = msgAnnotation.annotationText
        setAnnotations(prevAnnotations => {
            return {...prevAnnotations, ...{[patchAnnotation.id]: patchAnnotation}}
        });
    }

    function deleteAnno(toDelete) {
        setAnnotations(prevAnnotations => {
            const annotations = { ...prevAnnotations };
            delete annotations[toDelete.idAnnotation];
            return annotations;
        });
    }

    function initiateStompWS(pdfName) {
        stompClient.onConnect = (frame) => {
            console.log('Connection: ' + frame);
            stompClient.subscribe(`/session/${pdfName}`, (message) => {
                let msgAnnotation = JSON.parse(message.body);
                if(msgAnnotation.type === "delete") {
                    deleteAnno(msgAnnotation.message);
                }
                else if(msgAnnotation.type === "change") {
                    applyAnnotationChanges(msgAnnotation.message);
                }
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
            obj.text = a['annotationText'];
            obj.timeCreated = a['timeCreated'];
            newAnnotationsObj[a['idAnnotation']] = obj;
        });
        setAnnotations(newAnnotationsObj);
    }

    function sendMessage(anno) {
        stompClient.publish({
            destination: `/app/${pdfName}`,
            body: JSON.stringify({
                "message": anno,
                "type": "change"
            })
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
            setAnnotationCoordinates({ x, y });
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
        return await annotationAPI.saveAnnotation(pdfName, "", props)
            .then(saveAnnotationCB(props))
            .then((data) => {
                setTempHighlight(data);
                return data;
            });
    }

    async function addParagraphCustomAnnotation() {
        let selection = window.getSelection();
        if (selection.rangeCount < 1) return;
        const props = {selection: selection, category: currentCategory.current, annotation: "ParagraphCustom"};
        ParagraphCustomCalc(props);
        return await annotationAPI.saveAnnotation(pdfName, "", props)
            .then(saveAnnotationCB(props))
            .then((data) => {
                setTempHighlight(data);
                return data;
            });
    }

    async function addUnderlineAnnotation() {
        let selection = window.getSelection();
        if (selection.rangeCount < 1) return;
        const props = {
            selection: selection,
            category: currentCategory.current,
            annotation: "UnderlineAnnotation"
        };
        BoundingBoxCalc(props);
        return await annotationAPI.saveAnnotation(pdfName, "", props)
            .then(saveAnnotationCB(props))
            .then((data) => {
                setTempHighlight(data);
                return data;
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
        return await annotationAPI.saveAnnotation(pdfName, "", props)
            .then(saveAnnotationCB(props))
            .then((data) => {
                setTempHighlight(data);
                return data;
            });
    }

    async function addTinyText(category, x, y) {
        const newTinyText = {
            category: category,
            dataX: x,
            dataY: y,
            annotation: "TinyText"
        };
        return await annotationAPI.saveAnnotation(pdfName, "", newTinyText)
            .then(saveAnnotationCB(newTinyText));
    }

    async function addPostIt(category, x, y) {
        const newPostIt = {
            category: category,
            dataX: x,
            dataY: y,
            annotation: "PostIt"
        };
        return await annotationAPI.saveAnnotation(pdfName, "", newPostIt)
            .then(saveAnnotationCB(newPostIt));
    }

    function saveAnnotationCB(annotationObj) {
        return (data) => {
            annotationObj.id = data.idAnnotation;
            annotationObj.text = data.annotationText
            setAnnotations({...annotations, [annotationObj['id']]: annotationObj});
            return data;
        }
    }

    function onAnnotationChange(annotation) {
        sendMessage(annotation);
    }

    function toggleSidebar() {
        setShowSidebar(!showSidebar);
    }
    function deleteAnnotation(id) {
        annotationAPI.deleteAnnotation(id).then((anno) => {
            stompClient.publish({
                destination: `/app/${pdfName}`,
                body: JSON.stringify({
                    "message": anno,
                    "type": "delete"
                })
            });
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
            {showCommentBox && (
                <CommentBox
                    annotation={tempHighlight}
                    coordinates={annotationCoordinates}
                    onChange={onAnnotationChange}
                    onCancel={() => setShowCommentBox(false)}
                />
            )}
            <nav id="sidebar-nav">
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
            <section className={"sidebar " + ((showSidebar) ? "sidebar-deactivated" : "")}>
                <button className="sidebar-arrow" onClick={toggleSidebar}></button>
                <div className="sidebar-content">
                    {Object.keys(annotations).map(key => {
                        return <SidebarAnnotation annotation={annotations[key]} deleteAnnotation={deleteAnnotation} />
                    })}
                </div>
            </section>
        </section>
    );
}

export default Noteboard;
