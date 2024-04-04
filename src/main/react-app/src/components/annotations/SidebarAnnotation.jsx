import React, {useEffect, useRef, useState} from 'react';
import OptionsIcon from "./icons/OptionsIcon";

function SidebarAnnotation({ annotation, comment, loadComments, deleteAnnotation, deleteComment, createComment, editAnnotation, editComment, onChange }) {

    const [showInput, setShowInput] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [input, setInput] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [editedText, setEditedText] = useState(annotation.text);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState('');
    const [shownCommentOptionsMenuId, setShownCommentOptionsMenuId] = useState(null);

    const optionMenuRef = useRef(null);
    const commentOptionMenuRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (optionMenuRef.current && !optionMenuRef.current.contains(event.target)) {
            setShowOptions(false);
        }
        if (commentOptionMenuRef.current && !commentOptionMenuRef.current.contains(event.target)) {
            setShownCommentOptionsMenuId(null);
        }
    };

    useEffect(() => {
        console.log('comment prop:', comment)
        if(comment) {
            console.log('comment.id:', comment.idComment)
        }
        loadComments(annotation.id);
    }, []);


    const startEditing = () => {
        setIsEditing(true);
        setShowOptions(false);
    }

    const handleTextChange = (event) => {
        setEditedText(event.target.value);
    }

    const saveEditedAnno = () => {
        editAnnotation(annotation.id, editedText);
        setIsEditing(false);
    }

    const cancelEdit = () => {
        setIsEditing(false);
    }

    const switchShowInput = () => {
        setShowInput(!showInput);
    }

    const switchShowOptions = () => {
        if (shownCommentOptionsMenuId !== null) {
            setShownCommentOptionsMenuId(null);
        }
        setShowOptions(!showOptions);
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

    const deleteComm = (id) => {
        deleteComment(id);
    }

    const setCurrentInput = (event) => {
       setInput(event.target.value);
    }

    const handleCreateComment = () => {
        createComment(annotation.id, null, input)
            .then(() => {
                setInput("");
                switchShowInput();
                loadComments(annotation.id);
                if(!showComments) {
                    switchShowComments();
                }
            });
    };

    const startEditingComment = (id, text) => {
        console.log("comment id startEditingComment:", id)
        setEditingCommentId(id);
        setEditedCommentText(text);
        setIsEditingComment(true);
    }

    const saveEditedComment = () => {
        console.log("comment id saveEditedComment:", editingCommentId)
        editComment(editingCommentId, editedCommentText);
        setIsEditingComment(false);
    }

    const cancelEditComment = () => {
        setEditingCommentId(null);
    }

    const handleCommentTextChange = (event) => {
        setEditedCommentText(event.target.value);
    }

    const toggleCommentOptionsMenu = (id) => {
        if (showOptions) {
            setShowOptions(false);
        }
        setShownCommentOptionsMenuId(prevId => prevId === id ? null : id);
    }

    if(annotation.timeCreated) {
        let date = new Date(annotation.timeCreated)
        return (
            <div className={`sidebar-annotation sidebar-annotation-${annotation.category.toLowerCase()}`}>
                <div className="sidebar-annotation-header">
                    <div className="sidebar-annotation-header-info">
                        <div className="sidebar-annotation-header-info-user">ExampleUser</div>
                        <div className="sidebar-annotation-header-info-date">{date.toLocaleDateString("en-GB")}</div>

                    </div>
                    <div
                        className={`sidebar-annotation-header-options sidebar-annotation-header-options-${annotation.category.toLowerCase()} ${showOptions ? `sidebar-annotation-header-options-${annotation.category.toLowerCase()}-active` : ""}`}
                        onClick={switchShowOptions}>
                        <OptionsIcon/>
                    </div>
                </div>
                {showOptions && (
                <div className="sidebar-annotation-optionmenu" ref={optionMenuRef}>
                    <div className="sidebar-annotation-optionmenu-item" onClick={switchShowCategories}>Change Category</div>
                    <div className="sidebar-annotation-optionmenu-item sidebar-option-edit" onClick={startEditing}>Edit Annotation</div>
                    <div className="sidebar-annotation-optionmenu-item sidebar-option-delete" onClick={deleteAnno}>Delete Annotation</div>
                </div>
                )}
                {isEditing ? (
                    <div className="input-edit-group">
                        <input className="sidebar-annotation-textInput" value={editedText} onChange={handleTextChange}/>
                    </div>
                ) : (
                    <div className="sidebar-content-annotation-text">{annotation.text}</div>
                )}
                {isEditing && (
                    <div className="button-group">
                        <button className="sidebar-annotation-save" onClick={saveEditedAnno}>Save</button>
                        <button className="sidebar-annotation-cancel" onClick={cancelEdit}>Cancel</button>
                    </div>
                )}
                <div className="sidebar-annotation-footer">
                    <div
                        className={`sidebar-annotation-comment-input ${showInput ? "" : "sidebar-annotation-comment-input-hidden"}`}>
                        <input type="text" placeholder="Type here..." value={input} onChange={setCurrentInput}/>
                        <div className="sidebar-annotation-comment-input-send" onClick={handleCreateComment}>Send</div>
                    </div>
                    <div className="sidebar-annotation-control">
                        {comment && Object.keys(comment).length > 0 && (
                            <div className="sidebar-annotation-control-comments"
                                 onClick={switchShowComments}>{showComments ? "Hide Comments" : "Show Comments"}</div>
                        )}
                        <div className="sidebar-annotation-control-comments"></div>
                        <div className="sidebar-annotation-control-input"
                             onClick={switchShowInput}>{showInput ? "Cancel" : "Answer"}</div>
                    </div>
                    <div
                        className={`sidebar-annotation-comment-wrapper ${showComments ? "" : "sidebar-annotation-comment-wrapper-hidden"}`}>
                        {comment && Object.keys(comment).map(key => {
                            return <div className="sidebar-annotation-comment">
                                <div className="sidebar-annotation-comment-header">
                                    <div className="sidebar-annotation-comment-header-user">ExampleUser</div>
                                    <div
                                        className="sidebar-annotation-comment-header-date">{(new Date(comment[key].timeCreated)).toLocaleDateString("en-GB")}</div>
                                    <div
                                        className={`sidebar-annotation-comment-header-options sidebar-annotation-header-options-${annotation.category.toLowerCase()} ${shownCommentOptionsMenuId === comment[key].idComment ? `sidebar-annotation-header-options-${annotation.category.toLowerCase()}-active` : ""}`}
                                        onClick={() => toggleCommentOptionsMenu(comment[key].idComment)}>
                                        <OptionsIcon/>
                                        {shownCommentOptionsMenuId === comment[key].idComment && (
                                            <div className="sidebar-annotation-optionmenu" ref={commentOptionMenuRef}>
                                                <div className="sidebar-annotation-optionmenu-item sidebar-option-edit"
                                                     onClick={() => startEditingComment(comment[key].idComment, comment[key].commentText)}>
                                                    Edit Comment
                                                </div>
                                                <div
                                                    className="sidebar-annotation-optionmenu-item sidebar-option-delete"
                                                    onClick={() => deleteComm(comment[key].idComment)}>
                                                    Delete Comment
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {isEditingComment && editingCommentId === comment[key].idComment ? (
                                    <div className="input-edit-group">
                                        <input className="sidebar-annotation-textInput" value={editedCommentText}
                                               onChange={handleCommentTextChange}/>
                                        <div className="button-group">
                                            <button className="sidebar-annotation-save"
                                                    onClick={saveEditedComment}>Save
                                            </button>
                                            <button className="sidebar-annotation-cancel"
                                                    onClick={cancelEditComment}>Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="sidebar-annotation-comment-text">{comment[key].commentText}</div>
                                )}
                            </div>
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default SidebarAnnotation;