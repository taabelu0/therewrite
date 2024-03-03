import React from 'react';
import {annotationAPI} from "../../apis/annotationAPI";



function SidebarAnnotation({ annotation, deleteAnnotation, createComment }) {

    const deleteAnno = () => {
        deleteAnnotation(annotation.id);
    }

    const handleCreateComment = () => {
        // Replace 'userId' and 'commentText' with actual values
        createComment(annotation.id, null, 'Test comment text.');
    };


    if(annotation.timeCreated) {
        let date = new Date(annotation.timeCreated)
        return (
            <div className={`sidebar-content-annotation sidebar-content-annotation-${annotation.category.toLowerCase()}`}>
                <div className="sidebar-content-annotation-delete" onClick={deleteAnno}></div>
                <div className="sidebar-content-annotation-text">
                    {annotation.text}
                    <button onClick={handleCreateComment}>Add Comment</button>
                </div>
                <div className="sidebar-content-annotation-footer">
                    <div className="sidebar-content-annotation-footer-date">ExampleUser</div>
                    <div className="sidebar-content-annotation-footer-date">{date.toLocaleDateString("en-GB")}</div>
                </div>
            </div>
        );
    }
}

export default SidebarAnnotation;