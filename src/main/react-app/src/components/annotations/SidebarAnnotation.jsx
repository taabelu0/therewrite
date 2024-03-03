import React, {useEffect, useState} from 'react';

function SidebarAnnotation({ annotation, deleteAnnotation, oldComments }) {

    const [showInput, setShowInput] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState({});

    useEffect(() => {
        setComments(oldComments);
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
                        <input type="text" placeholder="Type here..."/>
                        <div className="sidebar-annotation-comment-input-send">Send</div>
                    </div>
                    <div className="sidebar-annotation-control">
                        <div className="sidebar-annotation-control-comments" onClick={switchShowComments}>{showComments ? "Hide Comments" : "Show Comments"}</div>
                        <div className="sidebar-annotation-control-input" onClick={switchShowInput}>{showInput ? "Cancel" : "Answer"}</div>
                    </div>
                    <div className={`sidebar-annotation-comment-wrapper ${showComments ? "" : "sidebar-annotation-comment-wrapper-hidden"}`}>
                        {Object.keys(comments).map(key => {
                            return <div className="sidebar-annotation-comment">
                                <div className="sidebar-annotation-comment-header">
                                    <div className="sidebar-annotation-comment-header-user">{comments[key].user}</div>
                                    <div className="sidebar-annotation-comment-header-date">{(new Date(comments[key].date)).toLocaleDateString("en-GB")}</div>
                                </div>
                                <div className="sidebar-annotation-comment-text">{comments[key].text}</div>
                            </div>
                        })}

                    </div>
                </div>
            </div>
        );
    }
}

export default SidebarAnnotation;