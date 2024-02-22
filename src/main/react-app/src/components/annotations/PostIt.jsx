import React, {useState, useRef, useEffect} from 'react';
import '../../style/post-it.scss';
import interact from 'interactjs';
import {annotationAPI} from "../../apis/annotationAPI";

export default function PostIt(props) {
    let {id, category, dataX, dataY, text}  = props.annotation;
    const [postitText, setPostitText] = useState(text);
    const postitTextRef = useRef(text);
    const postitRef = useRef(null);
    const [postitPosition, setPostitPosition] = useState({dataX: Number(dataX) || 0, dataY: Number(dataY) || 0});

    useEffect(() => {
        interact(postitRef.current).draggable({
            modifiers: [
                interact.modifiers.restrictRect({
                    endOnly: true
                })
            ],
            listeners: {
                move: dragMoveListener,
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
                annotationDetail: JSON.stringify({
                    ...props.annotation,
                    dataX: newX,
                    dataY: newY,
                    text: postitTextRef.current
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
            annotationDetail: JSON.stringify({
                category: category,
                dataX: x,
                dataY: y,
                text: text,
                annotation: "PostIt"
            })
        });
        props.onChange(postIt.data);
    }

    function valueChange(event) {
        setPostitText(event.target.value)
        props.onChange({
            idAnnotation: id,
            annotationDetail: JSON.stringify({
                ...props.annotation,
                text: event.target.value,
            })
        });
    }

    return (
        <div className={`post-it post-it-${category.toLowerCase()}`} ref={postitRef} style={{
            transform: `translate(${dataX}px, ${dataY}px)`
        }}>
            <div className="post-it-inner">
                <div className="post-it-card" />
                <textarea
                    className="post-it-input"
                    readOnly={true}
                    value={postitText}
                    onDoubleClick={enableTextEdit}
                    onBlur={disableTextEdit}
                    onChange={valueChange}// Add appropriate label
                />
            </div>
            <div className="post-it-username">username</div>
        </div>
    );
}
