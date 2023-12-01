import React, {useState, useRef, useEffect} from 'react';
import '../../style/tiny-text.scss';
import interact from 'interactjs';
import {annotationAPI} from "../../apis/annotationAPI";

export default function TinyText({ id, category, dataX, dataY, text }) {
    const [tinyText, setTinyText] = useState(text);
    const tinyTextRef = useRef(null);

    useEffect(() => {
        interact(tinyTextRef.current).draggable({
            modifiers: [
                interact.modifiers.restrictRect({
                    endOnly: true
                })
            ],
            listeners: {
                move: dragMoveListener
            }
        });
    }, []);

    function enableTextEdit(event) {
        let textArea = event.target;
        textArea.readOnly = false;
        textArea.focus();
        textArea.style.userSelect = true;
        textArea.classList.add("tiny-text-input-selected");
    }

    async function disableTextEdit(event) {
        let textArea = event.target;
        textArea.readOnly = true;
        textArea.style.userSelect = false;
        textArea.classList.remove("tiny-text-input-selected");

        await updateTinyText(id, textArea.value);
    }
    async function dragMoveListener(event) {
        const target = event.target;
        dataX += event.dx;
        dataY += event.dy;
        target.style.transform = `translate(${dataX}px, ${dataY}px)`;

        if (event.button === 0) {
            updateTinyTextDetails(id, dataX, dataY, tinyText);
        }
    }

    function rescaleTinyText(event) {
        let fake = document.createElement("div");
        fake.classList.add("tiny-text-fake");
        fake.innerText = event.target.value;
        event.target.parentElement.appendChild(fake);
        event.target.style.width = `${fake.clientWidth + 20}px`;

    }

    async function updateTinyTextDetails(id, x, y, text) {
        await annotationAPI.updateAnnotationDetails(id, x, y, "", text, "TinyText", category);
    }

    async function updateTinyText(id, text) {
        await annotationAPI.updateAnnotationText(id, text);
    }

    return (
        <div className={`tiny-text tiny-text-${category.toLowerCase()}`} ref={tinyTextRef} style={{
            transform: `translate(${dataX}px, ${dataY}px)`
        }}>
            <div className="tiny-text-input-wrapper">
                <input
                    type={"text"}
                    className="tiny-text-input"
                    readOnly={true}
                    value={tinyText}
                    onInput={rescaleTinyText}
                    onDoubleClick={enableTextEdit}
                    onBlur={disableTextEdit}
                    onChange={event => setTinyText(event.target.value)}
                />
            </div>
        </div>
    );
}
