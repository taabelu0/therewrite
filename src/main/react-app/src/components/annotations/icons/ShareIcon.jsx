import React, { useState } from 'react';
import Notify from "../../notification/Notify";

const ShareIcon = () => {
    const [showToast, setShowToast] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                setShowToast(true); // Show toast notification
            }, (err) => {
                console.error('Failed to copy text: ', err);
            });
    };

    return (
        <>
            <svg onClick={copyToClipboard}
                 xmlns="http://www.w3.org/2000/svg"
                 width="24"
                 height="24"
                 viewBox="0 0 24 24"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="2"
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 className="feather feather-share"
                 style={{ cursor: 'pointer' }}>
                <path d="M4 12V16a4 4 0 0 0 4 4h12"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            <Notify
                message="Link copied to clipboard!"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </>
    );
};

export default ShareIcon;
