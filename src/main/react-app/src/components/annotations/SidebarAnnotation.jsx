import React from 'react';
import {annotationAPI} from "../../apis/annotationAPI";



function SidebarAnnotation({ annotation, deleteAnnotation }) {

    const deleteAnno = () => {
        deleteAnnotation(annotation.id);
    }

    let date = new Date(annotation.timeCreated)
    if(annotation.text) {
        return (
            <div className={`sidebar-content-annotation sidebar-content-annotation-${annotation.category.toLowerCase()}`}>
                <div className="sidebar-content-annotation-delete" onClick={deleteAnno}></div>
                <div className="sidebar-content-annotation-text">{annotation.text}</div>
                <div className="sidebar-content-annotation-footer">
                    <div className="sidebar-content-annotation-footer-date">ExampleUser</div>
                    <div className="sidebar-content-annotation-footer-date">{date.toLocaleDateString("en-GB")}</div>
                </div>
            </div>
        );
    }
}

export default SidebarAnnotation;