import React, { useState } from 'react';
import '../style/sourcePopUp.scss';

export function SourcePopUp({ onClose, currentPdf }) {
    const [source, setSource] = useState('');
    const [copyRight, setCopyRight] = useState('');

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close-button" onClick={() => onClose('', '')}>&times;</span>
                <h2>Enter Details for "{currentPdf?.documentName}"</h2>
                <input type="text" placeholder="Source" value={source} onChange={e => setSource(e.target.value)} />
                <input type="text" placeholder="CopyRight" value={copyRight} onChange={e => setCopyRight(e.target.value)} />
                <button onClick={() => onClose(source, copyRight)}>Submit</button>
            </div>
        </div>
    );
}
