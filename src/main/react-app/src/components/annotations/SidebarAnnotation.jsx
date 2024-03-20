import React, { useState } from 'react';

function SidebarAnnotation({ annotation, deleteAnnotation, editAnnotation, onChange }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(annotation.text);

    const deleteAnno = () => {
        deleteAnnotation(annotation.id);
    }

    const startEditing = () => {
        setIsEditing(true);
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

    if(annotation.timeCreated) {
        let date = new Date(annotation.timeCreated)
        return (
            <div className={`sidebar-content-annotation sidebar-content-annotation-${annotation.category.toLowerCase()}`}>
                <div className="sidebar-content-annotation-delete" onClick={deleteAnno}></div>
                {isEditing ? (
                    <div className="input-edit-group">
                        <input className="sidebar-content-annotation-textInput" value={editedText} onChange={handleTextChange} />
                        <div className="sidebar-content-annotation-edit" onClick={startEditing}>Edit</div>
                    </div>
                ) : (
                    <div className="sidebar-content-annotation-text">{annotation.text}</div>
                )}
                <div className="sidebar-content-annotation-edit" onClick={startEditing}>Edit</div>
                {isEditing && (
                    <div className="button-group">
                        <button className="sidebar-content-annotation-save" onClick={saveEditedAnno}>Save</button>
                        <button className="sidebar-content-annotation-cancel" onClick={cancelEdit}>Cancel</button>
                    </div>
                )}
                    <div className="sidebar-content-annotation-footer">
                        <div className="sidebar-content-annotation-footer-date">ExampleUser</div>
                        <div className="sidebar-content-annotation-footer-date">{date.toLocaleDateString("en-GB")}</div>
                    </div>
                    </div>
                );
    }
}

                export default SidebarAnnotation;