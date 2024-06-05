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
    const postitPositionRef = useRef({ dataX: Number(dataX) || 0, dataY: Number(dataY) || 0 });
    const [postitSize, setPostitSize] = useState({ width: Number(width) || 200, height: Number(height) || 200 });
    const postitSizeRef = useRef({ width: Number(width) || 200, height: Number(height) || 200 });
    const [postitCategory, setPostitCategory] = useState(props.annotation.category);
    const postitCategoryRef = useRef(props.annotation.category);
    const [creator, setCreator] = useState(props.annotation.creator);
    const resizeCounter = useRef(0);

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
                        const count = ++resizeCounter.current;
                        const {x, y, width, height} = resize(event)
                        const timeout = 150;
                        props.onChange({
                            idAnnotation: id,
                            annotationText: postitTextRef.current,
                            annotationDetail: JSON.stringify({
                                ...props.annotation,
                                dataX: x,
                                dataY: y,
                                width,
                                height,
                                category: postitCategoryRef.current
                            })
                        });
                        const saveResize = () => {
                            if (count !== resizeCounter.current) {
                                setTimeout(saveResize, timeout)
                                return;
                            }
                            const xSave = postitPositionRef.current.dataX;
                            const ySave = postitPositionRef.current.dataY;
                            const widthSave = postitSizeRef.current.width;
                            const heightSave = postitSizeRef.current.height;
                            updatePostItDetails(id, xSave, ySave, postitTextRef.current, postitCategoryRef.current, widthSave, heightSave).finally();
                        }
                        setTimeout(saveResize, timeout)
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
        setPostitSize({ width: props.annotation.width, height: props.annotation.height });
        setPostitPosition({ dataX: props.annotation.dataX, dataY: props.annotation.dataY })
        setPostitCategory(props.annotation.category)
    }, [props.annotation]);

    useEffect(() => {
        postitCategoryRef.current = postitCategory;
    }, [postitCategory]);

    useEffect(() => {
        postitTextRef.current = postitText;
    }, [postitText]);

    useEffect(() => {
        postitSizeRef.current = postitSize;
    }, [postitSize]);

    useEffect(() => {
        postitPositionRef.current = postitPosition;
    }, [postitPosition]);

    function resize(event) {
        const { width, height } = event.rect;

        event.target.style.width = `${width}px`;
        event.target.style.height = `${height}px`;

        const target = event.target;

        const x = postitPositionRef.current.dataX
        const y = postitPositionRef.current.dataY

        target.style.transform = `translate(${x}px, ${y}px)`;

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);

        setPostitSize({ width, height });
        return {x, y, width, height};
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
                    dataY: newY,
                    width: postitSizeRef.current.width,
                    height: postitSizeRef.current.height,
                    category: postitCategoryRef.current
                })
            });
            target.style.transform = `translate(${newX}px, ${newY}px)`;
            if (event.button === 0) {
                updatePostItDetails(id, newX, newY, postitTextRef.current, postitCategoryRef.current, postitSizeRef.current.width, postitSizeRef.current.height);
            }
            return {dataX: newX, dataY: newY};
        });

    }

    async function updatePostItDetails(id, x, y, text, category, w, h) {
        await annotationAPI.updateAnnotation(id, {
            annotationText: text,
            annotationDetail: JSON.stringify({
                category: postitCategoryRef.current,
                dataX: x,
                dataY: y,
                width: w,
                height: h,
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
                ...props.annotation
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
        await updatePostItDetails(id, postitPosition.dataX, postitPosition.dataY, postitTextRef.current, postitCategoryRef.current, postitSizeRef.current.width, postitSizeRef.current.height);
    }

    return (
        <div id={id} className={`annotation-root post-it post-it-${postitCategory.toLowerCase()}`} ref={postitRef} style={{
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
            <div className="post-it-username">{creator.username}</div>
        </div>
    );
}
