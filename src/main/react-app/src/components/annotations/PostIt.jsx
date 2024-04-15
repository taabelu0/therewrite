import React, { useState, useRef, useEffect } from 'react';
import '../../style/post-it.scss';
import interact from 'interactjs';
import { annotationAPI } from "../../apis/annotationAPI";

export default function PostIt(props) {
    const { id, category, dataX, dataY, text, width, height } = props.annotation;
    const [postitText, setPostitText] = useState(text);
    const postitTextRef = useRef(text);
    const postitRef = useRef(null);
    const [postitPosition, setPostitPosition] = useState({ dataX: Number(dataX) || 0, dataY: Number(dataY) || 0 });
    const [postitSize, setPostitSize] = useState({ width: Number(width) || 200, height: Number(height) || 200 });

    useEffect(() => {
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
                edges: { left: false, right: true, bottom: true, top: false },
                listeners: {
                    move(event) {
                        const { width, height } = event.rect;

                        event.target.style.width = `${width}px`;
                        event.target.style.height = `${height}px`;

                        const x = parseFloat(event.target.getAttribute('data-x')) + event.deltaRect.left;
                        const y = parseFloat(event.target.getAttribute('data-y')) + event.deltaRect.top;

                        event.target.style.transform = `translate(${x}px, ${y}px)`;

                        event.target.setAttribute('data-x', x);
                        event.target.setAttribute('data-y', y);

                        setPostitSize({ width, height });

                        updatePostItDetails(id, postitPosition.dataX, postitPosition.dataY, postitTextRef.current, category, width, height);
                    }
                },
                modifiers: [
                    interact.modifiers.restrictEdges({
                        outer: 'parent'
                    }),
                    interact.modifiers.restrictSize({
                        min: { width: 100, height: 100 }
                    })
                ],
                inertia: true
            });
    }, []);

    useEffect(() => {
        setPostitText(text);
    }, [props]);

    useEffect(() => {
        postitTextRef.current = postitText;
    }, [postitText]);

    async function dragMoveListener(event) {
        const target = event.target;

        setPostitPosition(prevPosition => {
            const newX = prevPosition.dataX + event.dx;
            const newY = prevPosition.dataY + event.dy;
            const { width, height } = postitSize;

            props.onChange({
                idAnnotation: id,
                annotationText: postitTextRef.current,
                annotationDetail: JSON.stringify({
                    ...props.annotation,
                    dataX: newX,
                    dataY: newY,
                    width: width,
                    height: height
                })
            });

            target.style.transform = `translate(${newX}px, ${newY}px)`;



            if (event.button === 0) {
                updatePostItDetails(id, newX, newY, postitTextRef.current, category, postitSize.width, postitSize.height);
            }

            return { dataX: newX, dataY: newY, width: width, height: height};
        });
    }

    async function updatePostItDetails(id, x, y, text, category, width, height) {
        await annotationAPI.updateAnnotation(id, {
            annotationText: text,
            annotationDetail: JSON.stringify({
                category: category,
                dataX: x,
                dataY: y,
                width: width,
                height: height,
                annotation: "PostIt"
            })
        }).then(postIt => {
            props.onChange(postIt.data);
        });
    }

    function valueChange(event) {
        setPostitText(event.target.value);
        props.onChange({
            idAnnotation: id,
            annotationText: event.target.value,
            annotationDetail: JSON.stringify({
                ...props.annotation,
                width: postitSize.width,
                height: postitSize.height,
            })
        });
    }

    function enableTextEdit(event) {
        let textArea = event.target;
        textArea.readOnly = false;
        textArea.focus();
        textArea.style.userSelect = 'text';
        textArea.classList.add("post-it-input-selected");
    }

    async function disableTextEdit(event) {
        let textArea = event.target;
        textArea.readOnly = true;
        textArea.style.userSelect = 'none';
        textArea.classList.remove("post-it-input-selected");
        await updatePostItDetails(id, postitPosition.dataX, postitPosition.dataY, postitTextRef.current, category, postitSize.width, postitSize.height);
    }

    return (
        <div id={id} className={`annotation-root post-it post-it-${category.toLowerCase()}`} ref={postitRef} style={{
            transform: `translate(${postitPosition.dataX}px, ${postitPosition.dataY}px)`,
            width: `${postitSize.width}px`,
            height: `${postitSize.height}px`
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
