import React, { useState } from 'react';
import { annotationAPI } from "../apis/annotationAPI";

function CommentBox({ annotation, onSave, onCancel, coordinates }) {
    const [comment, setComment] = useState(annotation ? annotation.annotationText : '');

    const handleSave = () => {
        if (annotation) {
            if (comment !== annotation.annotationText) {
                updateCommentDetails(annotation.id, comment).then(r => console.log(r));
            }
            annotationAPI.updateAnnotation(annotation.id, {annotationText: comment});
        }
        onSave(comment);
    };

    async function updateCommentDetails(id, text) {
        const updatedAnnotation = {
            ...annotation,
            annotationText: text
        };
        await annotationAPI.updateAnnotation(id, updatedAnnotation);
    }

    return (
        <div className="comment-box" style={{ top: `${coordinates.y}px`, left: `${coordinates.x}px`, position: 'absolute', zIndex: 1000 }}>
            <textarea
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