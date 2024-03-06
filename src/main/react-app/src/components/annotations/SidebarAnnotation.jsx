import React, {useEffect, useState} from 'react';
import {commentAPI} from "../../apis/commentAPI";

function SidebarAnnotation({ annotation, deleteAnnotation, createComment }) {

    const [showInput, setShowInput] = useState(false);
    const [input, setInput] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState({});

    useEffect(() => {
        commentAPI.getComments(annotation.id).then((response) => {

            if(response) {
                response.forEach((newComment) => {
                    setComments(prevComment => {
                        return {...prevComment, ...{[newComment.idComment]: newComment}}
                    });
                });
            }
        });
    }, []);

    const switchShowInput = () => {
        setShowInput(!showInput);
    }

    const switchShowComments = () => {
        setShowComments(!showComments);
    }

    const deleteAnno = () => {
        deleteAnnotation(annotation.id);
    }

    const setCurrentInput = (event) => {
       setInput(event.target.value);
    }

    const handleCreateComment = () => {
        createComment(annotation.id, null, input).then((newComment) => {
            setComments(prevComment => {
                return {...prevComment, ...{[newComment.idComment]: newComment}}
            });
        });
        setInput("");
        switchShowInput();
    };


    if(annotation.timeCreated) {
        let date = new Date(annotation.timeCreated)
        return (
            <div className={`sidebar-annotation sidebar-annotation-${annotation.category.toLowerCase()}`}>
                <div className="sidebar-annotation-header">
                    <div className="sidebar-annotation-header-user">ExampleUser</div>
                    <div className="sidebar-annotation-header-date">{date.toLocaleDateString("en-GB")}</div>
                </div>
                <div className="sidebar-annotation-delete" onClick={deleteAnno}></div>
                <div className="sidebar-annotation-text">{annotation.text}</div>
                <div className="sidebar-annotation-footer">
                    <div className={`sidebar-annotation-comment-input ${showInput ? "" : "sidebar-annotation-comment-input-hidden"}`}>
                        <input type="text" placeholder="Type here..." value={input} onChange={setCurrentInput}/>
                        <div className="sidebar-annotation-comment-input-send" onClick={handleCreateComment}>Send</div>
                    </div>
                    <div className="sidebar-annotation-control">
                        <div className="sidebar-annotation-control-comments" onClick={switchShowComments}>{showComments ? "Hide Comments" : "Show Comments"}</div>
                        <div className="sidebar-annotation-control-input" onClick={switchShowInput}>{showInput ? "Cancel" : "Answer"}</div>
                    </div>
                    <div className={`sidebar-annotation-comment-wrapper ${showComments ? "" : "sidebar-annotation-comment-wrapper-hidden"}`}>
                        {Object.keys(comments).map(key => {
                            return <div className="sidebar-annotation-comment">
                                <div className="sidebar-annotation-comment-header">
                                    <div className="sidebar-annotation-comment-header-user">ExampleUser</div>
                                    <div className="sidebar-annotation-comment-header-date">{(new Date(comments[key].timeCreated)).toLocaleDateString("en-GB")}</div>
                                </div>
                                <div className="sidebar-annotation-comment-text">{comments[key].commentText}</div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default SidebarAnnotation;