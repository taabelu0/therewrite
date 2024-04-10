import React, {useEffect, useRef, useState} from "react";
import PostIt from "./annotations/PostIt";
import TinyText from "./annotations/TinyText";
import CommentBox from './CommentBox';
import SidebarAnnotation from "./annotations/SidebarAnnotation";
import '../style/annotations.scss';
import '../style/sidebar.scss';
import '../style/addAnnotation.scss';
import {ParagraphSideBar, ParagraphSideBarCalc} from "./annotations/ParagraphSideBar";
import {HighlightAnnotation} from "./annotations/HighlightAnnotation";
import {annotationAPI} from "../apis/annotationAPI";
import {UnderlineAnnotation} from "./annotations/UnderlineAnnotation";
import {Annotation, BoundingBoxCalc} from "./annotations/Annotation";
import * as StompJs from "@stomp/stompjs";
import {getPagesFromRange} from "react-pdf-highlighter/dist/cjs/lib/pdfjs-dom";
import {Squiggly} from "./annotations/Squiggly";
import {commentAPI} from "../apis/commentAPI";
import '../style/demo.scss';
import HighlightIcon from "./annotations/icons/HighlightIcon";
import UnderlineIcon from "./annotations/icons/UnderlineIcon";
import PostItIcon from "./annotations/icons/PostItIcon";
import TinyTextIcon from "./annotations/icons/TinyTextIcon";
import SquigglyIcon from "./annotations/icons/SquigglyIcon";
import ParagraphSidebarIcon from "./annotations/icons/ParagraphSidebarIcon";

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
    const [toggleAnnotationCategories,setToggleAnnotationCategories] = useState(false);

    const currentCategory = useRef(selectedCategory);

    const annoationCategories = [
        {
            name:"Definition",
            description:"Select this category to add definitions of terms you found in the documents."
        },
        {
            name:"Explosion",
            description: "Select to add terms, notes and descriptions or external resources, e.g. links to material you feel needs to included in the document."
        },
        {
            name: "Deletion",
            description: "Select to signal that you would like to delete specific terms in the document altogether. Add some thoughts or links to sources that explain why you feel the term should be deleted."
        },
        {
            name:"Correction",
            description: "Select to propose changes to the term in question. Note that correction has an authoritative connotation: you're suggesting a definitive replacement!"
        },
        {
            name: "Speculation",
            description: "Select this category if you would like to avoid the authoritative connotation of correction. Speculation is future-oriented, open-ended, evocative and can involve uncertain trajectories."
        },
        {
            name: "Addition",
            description: "For additions."
        }
    ]

    const toggleCategories = () => {
        setToggleAnnotationCategories(prevState => !prevState);
    }

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

    function applyCommentChanges(comment) {
        if (!comment) {
            console.error('Comment in message is null or undefined:', comment);
            return;
        }
        setComments(prevComments => {
            const existingComments = prevComments[comment.annotationId.idAnnotation] || [];
            const updatedComments = existingComments.map(existingComment => {
                if (existingComment.idComment === comment.idComment) {
                    return comment;
                }
                return existingComment;
            });
            return {
                ...prevComments,
                [comment.annotationId.idAnnotation]: updatedComments,
            };
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

    function deleteComm(toDelete) {
        setComments(prevComments => {
            const comments = {...prevComments};
            comments[toDelete.annotationId.idAnnotation] = comments[toDelete.annotationId.idAnnotation].filter(comment => comment.idComment !== toDelete.idComment);
            return comments;
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
                    case msgAnnotation.comment && msgAnnotation.type === "change":
                        applyCommentChanges(msgAnnotation.comment);
                        break;
                    case msgAnnotation.message && msgAnnotation.type === "delete":
                        deleteAnno(msgAnnotation.message);
                        break;
                    case msgAnnotation.comment && msgAnnotation.type === "delete":
                        deleteComm(msgAnnotation.comment);
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

    function sendComment(comm) {
        stompClient.publish({
            destination: `/app/${pdfID}`,
            body: JSON.stringify({
                "message": null,
                "comment": comm,
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
        if(creatingComponent === "PostIt" || creatingComponent === "TinyText") {
            setCreatingComponent(null);
        }
        setTimeout(async () => {
            let newAnno = await ADDING_COMPONENT[creatingComponent](selectedCategory, x, y);
            document.getSelection().deleteFromDocument();
            if(!newAnno) return;
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
            setAnnotations(prevAnnotations => {
                return {...prevAnnotations, [annotationObj['id']]: annotationObj}
            });
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
        changeSelected(selectedAnnotationRef.current, 'remove');
        let newSelected = document.getElementById(id);
        selectedAnnotationRef.current = newSelected;
        changeSelected(newSelected);
        scrollToAnnotation(document.getElementById(id));
    }

    function scrollToAnnotation(element) {
        const OFFSET = 100;
        let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        let top = (element.firstChild ? element.firstChild.getBoundingClientRect().top : element.getBoundingClientRect().top ) + window.scrollY;
        let left = (element.firstChild ? element.firstChild.getBoundingClientRect().left : element.getBoundingClientRect().left ) + window.scrollX;
        window.scroll({
            top: top - (vh / 2) + OFFSET,
            left: left - (vw / 2) + OFFSET,
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
        document.addEventListener('mousedown', e => {
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
            let sidebarElement = document.getElementById('sidebar-' + selectedAnnotationRef.current.id);
            if(sidebarElement) sidebarElement.scrollIntoView({behavior: "smooth"}); // scroll on sidebar

        }, {passive: true});
    }

    function changeSelected(element, keyword = 'add') {
        if (element?.classList) {
            element.classList[keyword]("selected-annotation");
            // also change class on sidebar element
            let sidebarElement = document.getElementById('sidebar-' + element.id);
            if(sidebarElement) sidebarElement.classList[keyword]("selected-annotation-sidebar");
        }
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
                    [annotationId]: allComments,
                }
            });
            console.log("all comments:", allComments)
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

    function editAnnotation(id, currentText) {
        console.log('editAnnotation called with id:', id, 'and text:', currentText);
        annotationAPI.updateAnnotation(id, {annotationText: currentText}).then((resp) => {
            if (resp) {
                sendMessage(resp.data);
            } else {
                console.error('Error: Failed to update annotation');
            }
        });
    }

    function deleteComment(id) {
        commentAPI.deleteComment(id).then((comm) => {
            stompClient.publish({
                destination: `/app/${pdfID}`,
                body: JSON.stringify({
                    "message": null,
                    "comment": comm,
                    "type": "delete"
                })
            });
        });
    }

    function editComment(id, currentText) {
        console.log('editComment called with id:', id, 'and text:', currentText);
        commentAPI.updateComment(id, {commentText: currentText}).then((resp) => {
            if (resp) {
                sendComment(resp.data);
            } else {
                console.error('Error: Failed to update annotation');
            }
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
                <nav id="demo-sidebar-nav">
                    <button className="toggleCategoriesBtn" onClick={toggleCategories}>Annotation Categories</button>
                    <p className="category-text">Select a category while annotating to mark your highlights and
                        notes.</p>
                    <div id="demo-category-selection">
                        {annoationCategories.map((cat, key) => (
                            <div
                                className={`demo-category demo-category-${cat.name.toLowerCase()} ${selectedCategory === cat.name ? "category-active" : ""} ${toggleAnnotationCategories ? 'demo-categories-open' : ''}`}
                                key={key}
                                onClick={() => setSelectedCategory(`${cat.name}`)}
                            >
                                <p className={"demo-category-title"}>{cat.name}</p>
                                <p className={`demo-category-desc`}>{cat.description}</p>
                            </div>
                        ))}
                    </div>
                    <div id="demo-toolbar">
                        <div className={`demo-styles ${'demo-styles-' + selectedCategory}`}>
                            <div
                                className={`demo-tool demo-add-post-it ${creatingComponent === "HighlightAnnotation" ? "demo-add-tool-active-" + selectedCategory : ""} ${'demo-tool-' + selectedCategory}`}
                                id="add-post-it-green"
                                onClick={() => setCreatingComponent("HighlightAnnotation")}
                            >
                                <HighlightIcon/>
                            </div>
                            <div
                                className={`demo-tool demo-add-post-it ${creatingComponent === "UnderlineAnnotation" ? "demo-add-tool-active-" + selectedCategory : ""} ${'demo-tool-' + selectedCategory}`}
                                onClick={() => setCreatingComponent("UnderlineAnnotation")}
                            >
                                <UnderlineIcon/>
                            </div>
                            <div
                                className={`demo-tool demo-add-post-it ${creatingComponent === "Squiggly" ? "demo-add-tool-active-" + selectedCategory : ""} ${'demo-tool-' + selectedCategory}`}
                                onClick={() => setCreatingComponent("Squiggly")}
                            >
                                <SquigglyIcon/>
                            </div>
                            <div
                                className={`demo-tool demo-add-post-it ${creatingComponent === "ParagraphSideBar" ? "demo-add-tool-active-" + selectedCategory : ""} ${'demo-tool-' + selectedCategory}`}
                                onClick={() => setCreatingComponent("ParagraphSideBar")}
                            >
                                <ParagraphSidebarIcon/>
                            </div>
                        </div>
                        <div className={`demo-styles ${'demo-styles-' + selectedCategory}`}>
                            <div
                                className={`demo-tool demo-add-post-it ${creatingComponent === "PostIt" ? "demo-add-tool-active-" + selectedCategory : ""} ${'demo-tool-' + selectedCategory}`}
                                onClick={() => setCreatingComponent("PostIt")}
                            >
                                <PostItIcon/>
                            </div>
                            <div
                                className={`demo-tool demo-add-post-it ${creatingComponent === "TinyText" ? "demo-add-tool-active-" + selectedCategory : ""} ${'demo-tool-' + selectedCategory}`}
                                id="add-post-it-yellow"
                                onClick={() => setCreatingComponent("TinyText")}
                            >
                                <TinyTextIcon/>
                            </div>
                        </div>
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
                        return <SidebarAnnotation annotation={annotations[key]} comment={comments[key]}
                                                  loadComments={loadCommentsByAnno} deleteAnnotation={deleteAnnotation}
                                                  deleteComment={deleteComment} createComment={createComment}
                                                  editAnnotation={editAnnotation} editComment={editComment}
                                                  onChange={onAnnotationChange} onSelection={onSidebarSelection}/>
                    })}
                </div>
            </section>
        </section>
    );
}

export default Noteboard;
