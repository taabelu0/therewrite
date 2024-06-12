import React, {useState, useRef, useEffect} from 'react';
import '../../style/tiny-text.scss';
import interact from 'interactjs';
import {annotationAPI} from "../../apis/annotationAPI";

export default function TinyText(props) {
    let {id, category, dataX, dataY, text} = props.annotation;
    let propWidth = props.annotation.width;
    let propHeight = props.annotation.height;
    const [tinyText, setTinyText] = useState(text);
    const tinyTextText = useRef(text);
    const tinyTextRef = useRef(null);
    const [tinyTextPosition, settinyTextPosition] = useState({dataX: Number(dataX) || 0, dataY: Number(dataY) || 0});
    const tinyTextPositionRef = useRef({dataX: Number(dataX) || 0, dataY: Number(dataY) || 0});
    const [tinyTextSize, setTinyTextSize] = useState({
        width: Number(propWidth),
        height: Number(propHeight)
    });
    const tinyTextSizeRef = useRef({width: Number(propWidth), height: Number(propHeight)});
    const [tinyTextCategory, setTinyTextCategory] = useState(props.annotation.category);
    const tinyTextCategoryRef = useRef(props.annotation.category);
    const resizeCounter = useRef(0);

    useEffect(() => {
        interact(tinyTextRef.current)
            .draggable({
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                        endOnly: true
                    })
                ],
                listeners: {move: dragMoveListener}
            })
            .resizable({
                edges: {left: false, right: true, bottom: true, top: false},
                listeners: {
                    move(event) {
                        const count = ++resizeCounter.current;
                        const {x, y, width, height} = resize(event)
                        const timeout = 150;
                        props.onChange({
                            idAnnotation: id,
                            annotationText: tinyTextText.current,
                            annotationDetail: JSON.stringify({
                                ...props.annotation,
                                dataX: x,
                                dataY: y,
                                width,
                                height,
                                category: tinyTextCategoryRef.current
                            })
                        });
                        const saveResize = () => {
                            if (count !== resizeCounter.current) {
                                setTimeout(saveResize, timeout)
                                return;
                            }
                            const xSave = tinyTextPositionRef.current.dataX;
                            const ySave = tinyTextPositionRef.current.dataY;
                            const widthSave = tinyTextSizeRef.current.width;
                            const heightSave = tinyTextSizeRef.current.height;
                            updateTinyTextDetails(id, xSave, ySave, tinyTextText.current, tinyTextCategoryRef.current, widthSave, heightSave).finally();
                        }
                        setTimeout(saveResize, timeout)
                    }
                },
                modifiers: [
                    interact.modifiers.restrictEdges({
                        outer: 'parent'
                    }),
                    interact.modifiers.restrictSize({
                        min: {width: 100, height: 25}
                    })
                ],
                inertia: true
            });
    }, []);

    useEffect(() => {
        setTinyText(text);
        setTinyTextSize({width: props.annotation.width, height: props.annotation.height});
        settinyTextPosition({dataX: props.annotation.dataX, dataY: props.annotation.dataY})
        setTinyTextCategory(props.annotation.category);
    }, [props.annotation]);

    useEffect(() => {
        if(tinyTextCategory) tinyTextCategoryRef.current = tinyTextCategory;
    }, [tinyTextCategory])

    useEffect(() => {
        tinyTextText.current = tinyText;
    }, [tinyText]);

    useEffect(() => {
        if (tinyTextSize.width && tinyTextSize.height) tinyTextSizeRef.current = tinyTextSize;
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

    function resize(event) {
        event.preventDefault();
        event.stopImmediatePropagation()
        const {width, height} = event.rect;

        event.target.style.width = `${width}px`;
        event.target.style.height = `${height}px`;

        const target = event.target;

        const x = tinyTextPositionRef.current.dataX
        const y = tinyTextPositionRef.current.dataY

        target.style.transform = `translate(${x}px, ${y}px)`;

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);

        setTinyTextSize({width, height});
        return {x, y, width, height};
    }

    async function disableTextEdit(event) {
        let textArea = event.target;
        textArea.readOnly = true;
        textArea.style.userSelect = false;
        textArea.classList.remove("tiny-text-input-selected");
        await updateTinyTextDetails(id, dataX, dataY, textArea.value, tinyTextCategoryRef.current, tinyTextSizeRef.current.width, tinyTextSizeRef.current.height);
    }

    async function dragMoveListener(event) {
        const target = event.target;
        let {dataX, dataY} = tinyTextPositionRef.current;
        dataX += event.dx;
        dataY += event.dy;
        props.onChange({
            idAnnotation: id,
            annotationText: tinyTextText.current,
            annotationDetail: JSON.stringify({
                ...props.annotation,
                dataX: dataX,
                dataY: dataY,
                width: tinyTextSizeRef.current.width,
                height: tinyTextSizeRef.current.height,
                category: tinyTextCategoryRef.current
            })
        });
        target.style.transform = `translate(${dataX}px, ${dataY}px)`;
        settinyTextPosition({dataX, dataY});
        if (event.button === 0) {
            await updateTinyTextDetails(id, dataX, dataY, tinyTextText.current, tinyTextCategoryRef.current, tinyTextSizeRef.current.width, tinyTextSizeRef.current.height);
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
        try {
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
        } catch(e) {
            console.error(e.message);
        }
    }

    function valueChange(event) {
        props.onChange({
            idAnnotation: id,
            annotationText: event.target.value,
            annotationDetail: JSON.stringify({
                ...props.annotation,
                category: tinyTextCategoryRef.current
            })
        });
        setTinyText(event.target.value)
    }

    return (
        <div id={id} className={`annotation-root tiny-text tiny-text-${tinyTextCategory.toLowerCase()}`}
             ref={tinyTextRef} style={{
            transform: `translate(${dataX}px, ${dataY}px)`,
            width: `${tinyTextSize.width}px`,
            height: `${tinyTextSize.height}px`
        }}>
            <div className="tiny-text-input-wrapper">
                <textarea
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
