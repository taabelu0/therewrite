import React, { useState } from 'react';

function CommentSideBar({ text, coordinates }) {
    return (
        <div
            className="comment-sidebar"
            style={{
                top: `${coordinates.y}px`,
                left: `${coordinates.x}px`,
                position: 'absolute',
                zIndex: 1000
            }}
        >
            <div className="comment-content">
                {text}
            </div>
        </div>
    );
}

export default CommentSideBar;