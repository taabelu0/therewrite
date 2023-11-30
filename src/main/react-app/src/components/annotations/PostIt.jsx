import React, {useState, useRef, useEffect} from 'react';
import '../../style/post-it.scss';
import interact from 'interactjs';
import GreenPostIt from "./postits/post-it-green.png";
import RedPostIt from "./postits/post-it-red.png";
import YellowPostIt from "./postits/post-it-yellow.png";
import {api} from "../../apis/config/axiosConfig";

export default function PostIt({ id, color, dataX, dataY, text }) {
    const [postitText, setPostitText] = useState(text);
    const postitRef = useRef(null);
    console.log("I AM A POSTIT", dataX, dataY, color);

    useEffect(() => {
        interact(postitRef.current).draggable({
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
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

        await updatePostItDetails(id, dataX, dataY, color, textArea.value);
    }

    async function dragMoveListener(event) {
        const target = event.target;
        dataX += event.dx;
        dataY += event.dy;
        target.style.transform = `translate(${dataX}px, ${dataY}px)`;

        await updatePostItDetails(id, dataX, dataY, color, text)
    }

    async function updatePostItDetails(id, x, y, color, text) {
        const annotation = {
            annotationId: id,
            dataX: x,
            dataY: y,
            color: color,
            annotationText: text,
            annotationDetail: JSON.stringify({"x": x, "y": y, "color": color,})
        };

        return api.put(`/api/updateAnnotation/${id}`,
            annotation
        )
            .catch((error) => {
                console.error('Error:', error);
            });
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
