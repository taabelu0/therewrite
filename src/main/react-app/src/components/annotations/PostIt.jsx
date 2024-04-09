import React, { useState, useRef, useEffect } from 'react';
import '../../style/post-it.scss';
import interact from 'interactjs';
import { annotationAPI } from "../../apis/annotationAPI";

export default function PostIt(props) {
    let { id, category, dataX, dataY, text } = props.annotation;
    const [postitText, setPostitText] = useState(text);
    const postitTextRef = useRef(text);
    const postitRef = useRef(null);
    const [postitPosition, setPostitPosition] = useState({ dataX: Number(dataX) || 0, dataY: Number(dataY) || 0 });

    useEffect(() => {
        // Initialize draggable functionality
        interact(postitRef.current)
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
                // Enable resize from all edges and corners
                edges: { left: true, right: true, bottom: true, top: true },
                listeners: {
                    move(event) {
                        let { width, height } = event.rect;
                        // Update the element's style to reflect the new size
                        event.target.style.width = `${width}px`;
                        event.target.style.height = `${height}px`;

                        // Update position to compensate for the resize from top/left edges
                        const x = parseFloat(event.target.getAttribute('data-x')) + event.deltaRect.left;
                        const y = parseFloat(event.target.getAttribute('data-y')) + event.deltaRect.top;

                        event.target.style.transform = `translate(${x}px, ${y}px)`;

                        event.target.setAttribute('data-x', x);
                        event.target.setAttribute('data-y', y);
                    }
                }
            });
    }, []);

    useEffect(() => {
        setPostitText(text);
    }, [props]);
    useEffect(() => {
        postitTextRef.current = postitText;
    }, [postitText]);

    function enableTextEdit(event) {
        let textArea = event.target;
        textArea.readOnly = false;
        textArea.focus();
        textArea.style.userSelect = true;
        textArea.classList.add("post-it-input-selected");
    }

    async function disableTextEdit(event) {
        let textArea = event.target;
        textArea.readOnly = true;
        textArea.style.userSelect = false;
        textArea.classList.remove("post-it-input-selected");
        await updatePostItDetails(id, postitPosition.dataX, postitPosition.dataY, postitTextRef.current, category);
    }

    async function dragMoveListener(event) {
        const target = event.target;

        setPostitPosition( (prevPosition) => {
            const newX = prevPosition.dataX + event.dx;
            const newY = prevPosition.dataY + event.dy;
            props.onChange({
                idAnnotation: id,
                annotationText: postitTextRef.current,
                annotationDetail: JSON.stringify({
                    ...props.annotation,
                    dataX: newX,
                    dataY: newY
                })
            });
            target.style.transform = `translate(${newX}px, ${newY}px)`;
            if (event.button === 0) {
                updatePostItDetails(id, newX, newY, postitTextRef.current, category);
            }
            return {dataX: newX, dataY: newY};
        });

    }

    async function updatePostItDetails(id, x, y, text, category) {
        let postIt = await annotationAPI.updateAnnotation(id, {
            annotationText: text,
            annotationDetail: JSON.stringify({
                category: category,
                dataX: x,
                dataY: y,
                annotation: "PostIt"
            })
        });
        props.onChange(postIt.data);
    }

    function valueChange(event) {
        setPostitText(event.target.value)
        props.onChange({
            idAnnotation: id,
            annotationText: event.target.value,
            annotationDetail: JSON.stringify({
                ...props.annotation
            })
        });
    }

    return (
        <div id={id} className={`annotation-root post-it post-it-${category.toLowerCase()}`} ref={postitRef} style={{
            transform: `translate(${postitPosition.dataX}px, ${postitPosition.dataY}px)`
        }}>
            <div className="post-it-inner">
                <div className="post-it-card" />
                <textarea
                    className="post-it-input"
                    readOnly={true}
                    value={postitText}
                    onDoubleClick={enableTextEdit}
                    onBlur={disableTextEdit}
                    onChange={valueChange}
                />
            </div>
            <div className="post-it-username">username</div>
        </div>
    );
}