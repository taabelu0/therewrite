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

    return (
        <div className="meta-header">
            <div className="meta-header-title">

            </div>
        </div>
    );
}

export default MetaHeader;