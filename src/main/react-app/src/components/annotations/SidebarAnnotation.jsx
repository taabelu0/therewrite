import React, {useEffect, useState} from 'react';
import {commentAPI} from "../../apis/commentAPI";

function SidebarAnnotation({ annotation, comments, loadComments, deleteAnnotation, createComment }) {

    const [showInput, setShowInput] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [input, setInput] = useState("");
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        loadComments(annotation.id);
    }, []);

    const switchShowInput = () => {
        setShowInput(!showInput);
    }

    const switchShowOptions = () => {
        setShowOptions(!showOptions);
        //setShowCategories(false);
    }

    const switchShowComments = () => {
        setShowComments(!showComments);
    }

    const switchShowCategories = () => {
        setShowCategories(!showCategories);
    }

    const deleteAnno = () => {
        deleteAnnotation(annotation.id);
    }

    const setCurrentInput = (event) => {
       setInput(event.target.value);
    }

    const handleCreateComment = () => {
        createComment(annotation.id, null, input);
        setInput("");
        switchShowInput();
    };

    if(annotation.timeCreated) {
        let date = new Date(annotation.timeCreated)
        return (
            <div className={`sidebar-annotation sidebar-annotation-${annotation.category.toLowerCase()}`}>
                <div className="sidebar-annotation-header">
                    <div className="sidebar-annotation-header-info">
                        <div className="sidebar-annotation-header-info-user">ExampleUser</div>
                        <div className="sidebar-annotation-header-info-date">{date.toLocaleDateString("en-GB")}</div>

                    </div>
                    <div className={`sidebar-annotation-header-options sidebar-annotation-header-options-${annotation.category.toLowerCase()} ${showOptions ? `sidebar-annotation-header-options-${annotation.category.toLowerCase()}-active` : ""}`} onClick={switchShowOptions}>
                        <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 342.382 342.382">
                            <g><g>
                            <g><path d="M45.225,125.972C20.284,125.972,0,146.256,0,171.191c0,24.94,20.284,45.219,45.225,45.219
                                    c24.926,0,45.219-20.278,45.219-45.219C90.444,146.256,70.151,125.972,45.225,125.972z"/></g>
                            <g><path d="M173.409,125.972c-24.938,0-45.225,20.284-45.225,45.219c0,24.94,20.287,45.219,45.225,45.219
                                    c24.936,0,45.226-20.278,45.226-45.219C218.635,146.256,198.345,125.972,173.409,125.972z"/></g>
                            <g><path d="M297.165,125.972c-24.932,0-45.222,20.284-45.222,45.219c0,24.94,20.29,45.219,45.222,45.219
                                    c24.926,0,45.217-20.278,45.217-45.219C342.382,146.256,322.091,125.972,297.165,125.972z"/></g>
                            </g></g>
                        </svg>
                    </div>
                </div>
                <div className="sidebar-annotation-optionmenu" style={{display: `${showOptions ? "block": "none"}`}}>
                    <div className="sidebar-annotation-optionmenu-item" onClick={switchShowCategories}>Change Category</div>
                    <div className="sidebar-annotation-optionmenu-item sidebar-option-delete" onClick={deleteAnno}>Delete Annotation</div>
                </div>
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
                        {comments && Object.keys(comments).map(key => {
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