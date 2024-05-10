import React, { useState, useEffect } from 'react';
import '../style/metaheader.scss';
import {pdfAPI} from "../apis/pdfAPI";

function MetaHeader({ pdfID }) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [documentPDF, setDocumentPDF] = useState(null);

    useEffect(() => {
        fetchDocument().then(r => console.log(r));
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.pageYOffset);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const fetchDocument = async () => {
        try {
            const doc = pdfAPI.getDocument(pdfID).then(
                r => setDocumentPDF(r)
            ).catch(e => console.error(e));

        } catch (error) {
            console.error("Error fetching document", error);
        }
    };


    return (
        <div className="meta-header">
            <div className="meta-header-title">
                <button className="documentBtn">Document</button>
                <h1 className="title" onClick={(r => console.log(documentPDF))}>{documentPDF?.documentName}</h1>
                <h2 className="subtitle">{documentPDF?.copyRight}</h2>
                <p className="labelTitle">Source:</p>
                <a className="source" href={documentPDF?.source}>{documentPDF?.source}</a>
            </div>
        </div>
    );
}

export default MetaHeader;