import React, {useState} from 'react';
import '../../style/post-it.css';
import GreenPostIt from "./postits/post-it-green.png";
import RedPostIt from "./postits/post-it-red.png";
import YellowPostIt from "./postits/post-it-yellow.png";

export default function PostIt({color,top,left,text}) {
    const [postitText, setPostitText] = useState(text);
    const postitImages = {
        green: GreenPostIt,
        red: RedPostIt,
        yellow: YellowPostIt
    };

    const postit = postitImages[color];

    if (postit === null) {
        return <p>No post-it available.</p>;
    }

    return (
        <div className="post-it"
             style={{top:top + "px" || 0,left:left + "px" || 0}}>
            <img src={postit} alt={`${color} post-it`} className="post-it-png"/>
            <textarea
                className="post-it-input"
                value={postitText}
                onChange={event => setPostitText(event.target.value)}
            />
        </div>
    );
}
