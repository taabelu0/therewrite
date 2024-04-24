import React, { useState, useEffect } from 'react';
import '../style/metaHeader.scss';

function MetaHeader({ pdfName }) {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.pageYOffset);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="meta-header" style={{ transform: `translateY(-${scrollPosition}px)` }}>
            <div className="meta-header-title">
                <h1>{pdfName}</h1>
            </div>
        </div>
    );
}

export default MetaHeader;