import '../../style/basic.css';
import '../../style/list.css';
import {useState} from "react";

export default function PostIt({ color }) {
    const [postitText,setPostitText] = useState("");
    
    return (
        <div className="post-it">
            <img src='../../../../resources/assets/postits/post-it-'{color}'.svg' className="post-it-svg" alt="post-its"/>
            <textarea className="post-it-input" value={postitText} onChange={e => setPostitText(e.target.value)}></textarea>
        </div>
    );
}
