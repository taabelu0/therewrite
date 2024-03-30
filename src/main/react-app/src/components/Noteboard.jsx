import React, {useEffect, useRef, useState} from "react";
import PostIt from "./annotations/PostIt";
import TinyText from "./annotations/TinyText";
import CommentBox from './CommentBox';
import SidebarAnnotation from "./annotations/SidebarAnnotation";
import '../style/annotations.scss';
import '../style/sidebar.scss';
import '../style/addAnnotation.scss';
import {ParagraphSideBar, ParagraphSideBarCalc} from "./annotations/ParagraphSideBar";
// import {ParagraphCustom, ParagraphCustomCalc} from "./annotations/ParagraphCustom";
import {HighlightAnnotation} from "./annotations/HighlightAnnotation";
import {annotationAPI} from "../apis/annotationAPI";
import {UnderlineAnnotation} from "./annotations/UnderlineAnnotation";
import {Annotation, BoundingBoxCalc} from "./annotations/Annotation";
import * as StompJs from "@stomp/stompjs";
import {getPagesFromRange} from "react-pdf-highlighter/dist/cjs/lib/pdfjs-dom";
import {Squiggly} from "./annotations/Squiggly";
import {commentAPI} from "../apis/commentAPI";

const ANNOTATION_COMPONENTS = {
    'HighlightAnnotation': HighlightAnnotation,
    'UnderlineAnnotation': UnderlineAnnotation,
    'TinyText': TinyText,
    'Squiggly': Squiggly,
    'ParagraphSideBar': ParagraphSideBar,
    'PostIt': PostIt
}; // define Annotation components here

let stompClient = new StompJs.Client({brokerURL: `ws://${process.env.REACT_APP_WS_URL}/ws`})

function Noteboard({pdfID}) {
    const [creatingComponent, setCreatingComponent] = useState(null);
    const [annotations, setAnnotations] = useState({});
    const [comments, setComments] = useState({});
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [tempHighlight, setTempHighlight] = useState(null); // contains database annotation object and not front-end object
    const [showSidebar, setShowSidebar] = useState(false);
    const [annotationCoordinates, setAnnotationCoordinates] = useState({x: 0, y: 0});
    const [selectedAnnotations, setSelectedAnnotations] = useState([]); // DOM element reference
    const selectedAnnotationRef = useRef({}); // DOM element reference
    let width = useRef("100%");
    let height = useRef("100%");
    const [selectedCategory, setSelectedCategory] = useState("Definition");

    const currentCategory = useRef(selectedCategory);

    const ADDING_COMPONENT = {
        "ParagraphSideBar": addParagraphAnnotation,
        "PostIt": addPostIt,
        "TinyText": addTinyText,
        'HighlightAnnotation': addHighlightAnnotation,
        'Squiggly': addSquigglyAnnotation,
        'UnderlineAnnotation': addUnderlineAnnotation
    }

    useEffect(() => {
        currentCategory.current = selectedCategory;
    }, [selectedCategory]);

    useEffect(() => {
        initiateStompWS(pdfID);
        loadAnnotations().finally();
        registerAnnotationSelect();
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
        patchAnnotation.timeCreated = msgAnnotation.timeCreated;
        setAnnotations(prevAnnotations => {
            return {...prevAnnotations, ...{[patchAnnotation.id]: patchAnnotation}}
        });
    }

    function addComment(annotationId, comment) {
        setComments(prevComments => {
            const existingComments = prevComments[annotationId] || [];
            return {
                ...prevComments,
                [annotationId]: [
                    ...existingComments,
                    comment
                ]
            };
        });
    }

    function deleteAnno(toDelete) {
        setAnnotations(prevAnnotations => {
            const annotations = {...prevAnnotations};
            delete annotations[toDelete.idAnnotation];
            return annotations;
        });
    }

    function initiateStompWS(pdfName) {
        stompClient.onConnect = (frame) => {
            console.log('Connection: ' + frame);
            stompClient.subscribe(`/session/${pdfName}`, (message) => {
                let msgAnnotation = JSON.parse(message.body);

                switch (true) {
                    case msgAnnotation.message && msgAnnotation.type === "change":
                        applyAnnotationChanges(msgAnnotation.message);
                        break;
                    case msgAnnotation.message && msgAnnotation.type === "delete":
                        deleteAnno(msgAnnotation.message);
                        break;
                    case msgAnnotation.comment && msgAnnotation.type === "change":
                        addComment(msgAnnotation.comment.annotationId.idAnnotation, msgAnnotation.comment);
                        break;
                    case msgAnnotation.comment && msgAnnotation.type === "delete":
                        break;
                    default:
                        console.error('Unknown message type:', msgAnnotation.type);
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
        let newAnnotations = await annotationAPI.getList(pdfID);
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
            destination: `/app/${pdfID}`,
            body: JSON.stringify({
                "message": anno,
                "comment": null,
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
        setCreatingComponent(null);
        setTimeout(async () => {
            let newAnno = await ADDING_COMPONENT[creatingComponent](selectedCategory, x, y);
            if (!newAnno) return;
            sendMessage(newAnno); // notifies websocket
            setAnnotationCoordinates({x, y});
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
        if (!isRangeExisting(selection)) return;
        let props = {
            selection: selection,
            category: currentCategory.current,
            annotation: "ParagraphSideBar"
        };
        ParagraphSideBarCalc(props);
        return await annotationAPI.saveAnnotation(pdfID, "", props)
            .then(saveAnnotationCB(props))
            .then((data) => {
                setTempHighlight(data);
                return data;
            });
    }

    async function addSquigglyAnnotation() {
        let selection = window.getSelection();
        if (!isRangeExisting(selection)) return;
        const props = {
            selection: selection,
            category: currentCategory.current,
            annotation: "Squiggly"
        };
        BoundingBoxCalc(props);
        return await annotationAPI.saveAnnotation(pdfID, "", props)
            .then(saveAnnotationCB(props))
            .then((data) => {
                setTempHighlight(data);
                return data;
            });
    }

    async function addUnderlineAnnotation() {
        let selection = window.getSelection();
        if (!isRangeExisting(selection)) return;
        const props = {
            selection: selection,
            category: currentCategory.current,
            annotation: "UnderlineAnnotation"
        };
        BoundingBoxCalc(props);
        return await annotationAPI.saveAnnotation(pdfID, "", props)
            .then(saveAnnotationCB(props))
            .then((data) => {
                setTempHighlight(data);
                return data;
            });
    }

    async function addHighlightAnnotation() {
        let selection = window.getSelection();
        if (!isRangeExisting(selection)) return;
        const props = {
            selection: selection,
            category: currentCategory.current,
            annotation: "HighlightAnnotation"
        };
        BoundingBoxCalc(props);
        return await annotationAPI.saveAnnotation(pdfID, "", props)
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
        return await annotationAPI.saveAnnotation(pdfID, "type here...", newTinyText)
            .then(saveAnnotationCB(newTinyText));
    }

    async function addPostIt(category, x, y) {
        const newPostIt = {
            category: category,
            dataX: x,
            dataY: y,
            annotation: "PostIt"
        };
        return await annotationAPI.saveAnnotation(pdfID, "", newPostIt)
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

    async function createComment(annotationId, userId, commentText) {
        try {
            const comment = await commentAPI.createComment(annotationId, userId, commentText);
            stompClient.publish({
                destination: `/app/${pdfID}`,
                body: JSON.stringify({
                    "message": null,
                    "comment": comment,
                    "type": "change"
                })
            });
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    }

    function onSidebarSelection(event, id) {
        scrollToAnnotation(document.getElementById(id));
    }

    function scrollToAnnotation(element) {
        const OFFSET = 100;
        let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        let top = (element.firstChild ? element.firstChild.getBoundingClientRect().top : element.getBoundingClientRect().top ) + window.scrollY;
        window.scroll({
            top: top - (vh / 2) + OFFSET,
            behavior: 'smooth'
        });
    }

    function isRangeExisting(selection) {
        return selection.rangeCount > 0 && !selection.isCollapsed && getPagesFromRange(selection.getRangeAt(0)).length > 0;
    }

    function onAnnotationChange(annotation) {
        sendMessage(annotation);
    }

    function registerAnnotationSelect() {
        document.addEventListener('click', e => {
            const allAnnos = document.querySelectorAll('.annotation');
            allAnnos.forEach(element => element.style.pointerEvents = 'auto'); // enable pointer events
            const elements = document.elementsFromPoint(e.clientX, e.clientY); // get elements at mouse position
            allAnnos.forEach(element => element.style.pointerEvents = 'none'); // disable them again
            const annotationElements = [];
            elements.map(e => {
                if (e.classList.contains("annotation-root")) annotationElements.push(e); // classList uses contains instead of includes
                else {
                    let parent = e.closest(".annotation-root");
                    if (parent) annotationElements.push(parent); // add parent if parent is annotation
                }
            });
            if (annotationElements.length <= 0) return;
            setSelectedAnnotations(prevAnnos => {
                if (prevAnnos.length === annotationElements.length) {
                    if (prevAnnos.filter(pA => !annotationElements.includes(pA)).length === 0) { // if they are equal
                        if (annotationElements.length > 1) {
                            let prevFirst = prevAnnos.shift();
                            prevAnnos.push(prevFirst);
                            changeSelected(selectedAnnotationRef.current, 'remove');
                            selectedAnnotationRef.current = prevAnnos[0];
                            changeSelected(selectedAnnotationRef.current);
                        }
                        return prevAnnos;
                    }
                }
                if (selectedAnnotationRef.current !== annotationElements[0]) {
                    changeSelected(selectedAnnotationRef.current, 'remove');
                    selectedAnnotationRef.current = annotationElements[0];
                    changeSelected(selectedAnnotationRef.current);
                }
                return annotationElements;
            });
            document.getElementById('sidebar-' + selectedAnnotationRef.current.id).scrollIntoView({behavior: "smooth"});
        }, {passive: true});
    }

    function changeSelected(element, keyword = 'add') {
        if (element?.classList) element.classList[keyword]("selected-annotation");
    }

    function toggleSidebar() {
        setShowSidebar(!showSidebar);
    }

    function loadCommentsByAnno(annotationId) {
        commentAPI.getComments(annotationId).then((allComments) => {
            console.log(annotationId)
            setComments(prevComments => {
                return {
                    ...prevComments,
                    [annotationId]: allComments
                }
            });
        });
    }

    function deleteAnnotation(id) {
        annotationAPI.deleteAnnotation(id).then((anno) => {
            stompClient.publish({
                destination: `/app/${pdfID}`,
                body: JSON.stringify({
                    "message": anno,
                    "comment": null,
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
                        className={`tool add-post-it ${creatingComponent === "Squiggly" ? "add-tool-active" : ""}`}
                        onClick={() => setCreatingComponent("Squiggly")}
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
                        return <SidebarAnnotation annotation={annotations[key]} comments={comments[key]}
                                                  loadComments={loadCommentsByAnno} deleteAnnotation={deleteAnnotation}
                                                  createComment={createComment} onSelection={onSidebarSelection}/>
                    })}
                </div>
            </section>
        </section>
    );
}

export default Noteboard;
