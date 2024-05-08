import React, { useState, useEffect } from 'react';
import '../style/metaheader.scss';

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

    const headerStyle = {
        top: `${-scrollPosition}px`,
        transition: 'top 0.3s'
    };

    return (
        <div className="meta-header">
            <div className="meta-header-title">
                <h1 className="title">{pdfName}</h1>
                <h2 className="subtitle">Copyright information</h2>
                <p className="labelTitle">Source:</p>
                <a className="source" href="https://web0.fhnw.ch/ht/informatik/ip34/24vt/therewrite/index.html">https://web0.fhnw.ch/ht/informatik/ip34/24vt/therewrite/index.html</a>
            </div>
        </div>
    );
}

export default MetaHeader;