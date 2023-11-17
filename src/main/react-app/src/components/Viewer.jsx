import '../style/basic.css';
import '../style/list.css';
import '../style/viewer.css';
import './annotations/PostIt.jsx';
import {useParams} from "react-router-dom";

function PDFViewer() {
    let { pdfName } = useParams();
    return (
        <div id="pdfCanvasContainer">
            <span>{pdfName}</span>
        </div>
    );
}

function addPostIt() {

}

export default PDFViewer;
