import React, {useState, useRef, useEffect} from 'react';
import '../../style/post-it.css';
import interact from 'interactjs';
import GreenPostIt from "./postits/post-it-green.png";
import RedPostIt from "./postits/post-it-red.png";
import YellowPostIt from "./postits/post-it-yellow.png";

export default function PostIt({ color, top, left, text }) {
    const [postitText, setPostitText] = useState(text);
    const postitRef = useRef(null);

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

    function dragMoveListener(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

    const postitImages = {
        green: GreenPostIt,
        red: RedPostIt,
        yellow: YellowPostIt,
    };

    const postitImage = postitImages[color];

    return (
        <div className="post-it" ref={postitRef} style={{ top: top + "px", left: left + "px" }}>
            <img src={postitImage} alt={`${color} post-it`} className="post-it-png" />
            <textarea
                className="post-it-input"
                value={postitText}
                onChange={event => setPostitText(event.target.value)}
            />
        </div>
    );
}
