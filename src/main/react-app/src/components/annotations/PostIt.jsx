import React, {useState, useRef, useEffect} from 'react';
import '../../style/post-it.scss';
import interact from 'interactjs';
import GreenPostIt from "./postits/post-it-green.png";
import RedPostIt from "./postits/post-it-red.png";
import YellowPostIt from "./postits/post-it-yellow.png";
import {api} from "../../apis/config/axiosConfig";
import {annotationAPI} from "../../apis/annotationAPI";

export default function PostIt({ id, color, dataX, dataY, text }) {
    const [postitText, setPostitText] = useState(text);
    const postitRef = useRef(null);
    const [postitPosition, setPostitPosition] = useState({ dataX, dataY });

    useEffect(() => {
        interact(postitRef.current).draggable({
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
        textArea.classList.add("post-it-input-selected");
    }

    async function disableTextEdit(event) {
        let textArea = event.target;
        textArea.readOnly = true;
        textArea.style.userSelect = false;
        textArea.classList.remove("post-it-input-selected");

        await updatePostItText(id, textArea.value);
    }

    async function dragMoveListener(event) {
        const target = event.target;

        setPostitPosition((prevPosition) => {
            const newX = prevPosition.dataX + event.dx;
            const newY = prevPosition.dataY + event.dy;
            target.style.transform = `translate(${newX}px, ${newY}px)`;

            if (event.button === 0) {
                updatePostItDetails(id, newX, newY, color, postitText);
            }

            return { dataX: newX, dataY: newY };
        });
    }

    async function updatePostItDetails(id, x, y, color, text) {
        await annotationAPI.updatePostItDetails(id, x, y, color, text);
    }

    async function updatePostItText(id, text) {
        await annotationAPI.updatePostItText(id, text);
    }

    const postitImages = {
        green: GreenPostIt,
        red: RedPostIt,
        yellow: YellowPostIt,
    };

    const postitImage = postitImages[color];

    return (
        <div className="post-it" ref={postitRef} style={{
            transform: `translate(${dataX}px, ${dataY}px)`
        }}>
            <div className={"post-it-inner"}>
                <img src={postitImage} alt={`${color} post-it`} className="post-it-png" />
                <textarea
                    className="post-it-input"
                    readOnly={true}
                    value={postitText}
                    onDoubleClick={enableTextEdit}
                    onBlur={disableTextEdit}
                    onChange={event => setPostitText(event.target.value)}
                />
            </div>
        </div>
    );
}
