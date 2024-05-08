import React, { useState, useEffect } from 'react';
import '../../style/notify.scss';

const Notify = ({ message, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="notify">
            {message}
        </div>
    );
};

export default Notify;
