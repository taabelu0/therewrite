import React from 'react';

function SidebarAnnotation({ annotation }) {
    if(annotation.text) {
        return (
            <div className={`sidebar-content-annotation sidebar-content-annotation-${annotation.category.toLowerCase()}`}>
                <div className="sidebar-content-annotation-header">
                    <div className="sidebar-content-annotation-header-user">ExampleUser</div>
                    <div className="sidebar-content-annotation-header-date">26. 05. 2024</div>
                </div>
                <div className="sidebar-content-annotation-text">{annotation.text}</div>
            </div>
        );
    }
}

export default SidebarAnnotation;