import React, {useState, useRef, useEffect} from 'react';
import '../../style/tiny-text.scss';
import interact from 'interactjs';
import {annotationAPI} from "../../apis/annotationAPI";

export default function TinyText(props) {
    let {id, category, dataX, dataY, text, propWidth, propHeight }  = props.annotation;
    const [tinyText, setTinyText] = useState(text);
    const tinyTextText = useRef(text);
    const tinyTextRef = useRef(null);
    const [tinyTextPosition, settinyTextPosition] = useState({ dataX: Number(dataX) || 0, dataY: Number(dataY) || 0 });
    const tinyTextPositionRef = useRef({ dataX: Number(dataX) || 0, dataY: Number(dataY) || 0 });
    const [tinyTextSize, setTinyTextSize] = useState({ width: Number(propWidth) || 200, height: Number(propHeight) || 200 });
    const tinyTextSizeRef = useRef({ width: Number(propWidth) || 200, height: Number(propHeight) || 200 });

    useEffect(() => {
        interact(tinyTextRef.current)
            .draggable({
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                        endOnly: true
                    })
                ],
                listeners: { move: dragMoveListener }
            })
            .resizable({
                edges: { left: false, right: true, bottom: true, top: false },
                listeners: {
                    move(event) {
                        const { width, height } = event.rect;

                        event.target.style.width = `${width}px`;
                        event.target.style.height = `${height}px`;

                        const target = event.target;

                        const x = tinyTextPositionRef.current.dataX
                        const y = tinyTextPositionRef.current.dataY

                        target.style.transform = `translate(${x}px, ${y}px)`;

                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);

                        setTinyTextSize({ width, height });

                        updateTinyTextDetails(id, x, y, tinyTextText.current, category, width, height).finally();
                    }
                },
                modifiers: [
                    interact.modifiers.restrictEdges({
                        outer: 'parent'
                    }),
                    interact.modifiers.restrictSize({
                        min: { width: 100, height: 25 }
                    })
                ],
                inertia: true
            });
    }, []);

    useEffect(() => {
        setTinyText(text);
        setTinyTextSize({ width: props.width, height: props.height });
        settinyTextPosition({ dataX: props.annotation.dataX, dataY: props.annotation.dataY })
    }, [props]);

    useEffect(() => {
        tinyTextText.current = tinyText;
    }, [tinyText]);

    useEffect(() => {
        tinyTextSizeRef.current = tinyTextSize;
    }, [tinyTextSize]);

    useEffect(() => {
        tinyTextPositionRef.current = tinyTextPosition;
    }, [tinyTextPosition]);

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
        await updateTinyTextDetails(id, dataX, dataY, textArea.value, category, tinyTextSizeRef.current.height, tinyTextSizeRef.current.width);
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
            await updateTinyTextDetails(id, dataX, dataY, tinyTextText.current, category, tinyTextSizeRef.current.width, tinyTextSizeRef.current.height);
        }
    }

    function rescaleTinyText(event) {
        let fake = document.createElement("div");
        fake.classList.add("tiny-text-fake");
        fake.innerText = event.target.value;
        event.target.parentElement.appendChild(fake);
        event.target.style.width = `${fake.clientWidth + 20}px`;
    }

    async function updateTinyTextDetails(id, x, y, text, category, w, h) {
        let tinyText = await annotationAPI.updateAnnotation(id, {
            annotationText: text,
            annotationDetail: JSON.stringify({
                category: category,
                dataX: x,
                dataY: y,
                width: w,
                height: h,
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
        <div id={id} className={`annotation-root tiny-text tiny-text-${category.toLowerCase()}`} ref={tinyTextRef} style={{
            transform: `translate(${dataX}px, ${dataY}px)`,
            width: `${tinyTextSize.width}px`,
            height: `${tinyTextSize.height}px`
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
                    style={{
                        width: `${tinyTextSize.width}px`,
                        height: `${tinyTextSize.height}px`
                    }}
                />
            </div>
        </div>
    );
}
