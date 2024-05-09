import React, {useEffect, useState} from 'react';
import {annotationAPI} from "../apis/annotationAPI";

function CommentBox({annotation, onCancel, coordinates, onChange}) {
    const [comment, setComment] = useState(annotation ? annotation.annotationText : '');

    const handleSave = () => {
        if (annotation) {
            if (comment !== annotation.annotationText) {
                updateCommentDetails(annotation.idAnnotation, comment).then(r => console.log(r));
            }
        } else {
            console.log("Unable to save comment. Annotation is not defined.");
        }
    };

    async function updateCommentDetails(id, text) {
        const updatedAnnotation = {
            annotationText: text
        };
        await annotationAPI.updateAnnotation(id, updatedAnnotation).then(resp => onChange(resp.data));
        onCancel();
    }

    return (
        <div className="comment-box"
             style={{top: `${coordinates.y}px`, left: `${coordinates.x}px`, position: 'absolute'}}>
            <textarea
                autoFocus
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment here..."
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
}

export default CommentBox;