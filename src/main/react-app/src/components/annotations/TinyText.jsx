import React, {useState, useRef, useEffect} from 'react';
import '../../style/tiny-text.scss';
import interact from 'interactjs';

export default function TinyText({ category, dataX, dataY, text }) {
    const [tinyText, setTinyText] = useState(text);
    const tinyTextRef = useRef(null);

    useEffect(() => {
        interact(tinyTextRef.current).draggable({
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
        textArea.classList.add("tiny-text-input-selected");
    }

    function disableTextEdit(event) {
        let textArea = event.target;
        textArea.readOnly = true;
        textArea.style.userSelect = false;
        textArea.classList.remove("tiny-text-input-selected");
    }
    function dragMoveListener(event) {
        const target = event.target;
        dataX += event.dx;
        dataY += event.dy;
        target.style.transform = `translate(${dataX}px, ${dataY}px)`;
    }

    return (
        <div className={`tiny-text tiny-text-${category.toLowerCase()}`} ref={tinyTextRef} style={{
            transform: `translate(${dataX}px, ${dataY}px)`
        }}>
            <textarea
                className="tiny-text-input"
                readOnly={true}
                value={tinyText}
                onDoubleClick={enableTextEdit}
                onBlur={disableTextEdit}
                onChange={event => setTinyText(event.target.value)}
            />
        </div>
    );
}
