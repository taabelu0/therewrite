import React, {useState, useRef, useEffect} from 'react';
import '../../style/tiny-text.scss';
import interact from 'interactjs';
import {annotationAPI} from "../../apis/annotationAPI";

export default function TinyText(props) {
    let {id, category, dataX, dataY, text}  = props.annotation;
    const [tinyText, setTinyText] = useState(text);
    const tinyTextText = useRef(text);
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

    useEffect(() => {
        setTinyText(text);
    }, [props]);
    useEffect(() => {
        tinyTextText.current = tinyText;
    }, [tinyText]);

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
        await updateTinyTextDetails(id, dataX, dataY, textArea.value, category);
    }
    async function dragMoveListener(event) {
        const target = event.target;
        dataX += event.dx;
        dataY += event.dy;
        props.onChange({
            idAnnotation: id,
            annotationText: tinyTextText.current,
            annotationDetail: JSON.stringify({
                ...props.annotation,
                dataX: dataX,
                dataY: dataY,
            })
        });
        target.style.transform = `translate(${dataX}px, ${dataY}px)`;
        if (event.button === 0) {
            await updateTinyTextDetails(id, dataX, dataY, tinyTextText.current, category);
        }
    }

    function rescaleTinyText(event) {
        let fake = document.createElement("div");
        fake.classList.add("tiny-text-fake");
        fake.innerText = event.target.value;
        event.target.parentElement.appendChild(fake);
        event.target.style.width = `${fake.clientWidth + 20}px`;
    }

    async function updateTinyTextDetails(id, x, y, text, category) {
        let tinyText = await annotationAPI.updateAnnotation(id, {
            annotationText: text,
            annotationDetail: JSON.stringify({
                category: category,
                dataX: x,
                dataY: y,
                annotation: "TinyText"
            })
        });
        props.onChange(tinyText.data);
    }

    function valueChange(event) {
        props.onChange({
            idAnnotation: id,
            annotationText: event.target.value,
            annotationDetail: JSON.stringify({
                ...props.annotation,
            })
        });
        setTinyText(event.target.value)
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
                    onChange={valueChange}
                />
            </div>
        </div>
    );
}
