import '../style/basic.css';
import '../style/list.css';
import '../style/viewer.scss';
import './annotations/PostIt.jsx';
import {useParams} from "react-router-dom";
import {useState, useRef, useEffect} from 'react';
import {GlobalWorkerOptions, getDocument, renderTextLayer, Util} from 'pdfjs-dist';
import PostIt from "./annotations/PostIt";
GlobalWorkerOptions.workerSrc = "/script/pdf.worker.4.0.min.js";

const PDFViewer = () => {
    const [numPages, setNumPages] = useState(null);
    const [pdf, setPDF] = useState(null);
    const viewerPageRefs = useRef([]);
    let {pdfName} = useParams();
    let file = 'http://localhost:8080/pdf/get/' + pdfName;

    useEffect(() => {
        const loadingTask = getDocument(file);
        loadingTask.promise.then(_pdf => {
            viewerPageRefs.current = new Array(_pdf.numPages);
            setNumPages(_pdf.numPages);
            setPDF(_pdf);
        }).catch(err => {
            console.error('Error during PDF loading or rendering:', err);
        });
    }, [file]);

    useEffect(() => {
        if (pdf != null) {
            for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                renderPage(pdf, pageNumber).finally();
            }
            setPDF(null);
        }
    }, [pdf]);

    function renderPage(_pdf, pageNumber) {
        return _pdf.getPage(pageNumber).then(page => {
            let viewerPage = viewerPageRefs.current[pageNumber - 1];
            let canvas = viewerPage.querySelector(".viewer-page-canvas");
            let textLayerDiv = viewerPage.querySelector(".viewer-page-text");
            if (!canvas) {
                console.error(`Canvas for page ${pageNumber} is not initialized.`);
                return;
            }

            /* All this is needed, as text contents of the text layer are formatted using absolute values, thus
            * they do not scale with the width of the outer div, but the width of the viewport it was given at
            * calculation/creation time.                                                                    */
            let tempViewport = page.getViewport({scale: 1}); // Look up at what resolution it wants to render at default
            let scale = viewerPage.offsetWidth / tempViewport.width; // Calc scale to fit effective width
            let viewport = page.getViewport({scale}); // Create effective viewport with new scale

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            textLayerDiv.style.setProperty('--scale-factor', scale);

            page.render({
                canvasContext: canvas.getContext('2d'),
                viewport: viewport
            });
            page.getTextContent().then((textContent) => {
                let smt = renderTextLayer({
                    textContentSource: textContent,
                    container: textLayerDiv,
                    viewport: viewport
                })
                console.log(smt);
            });

        });
    };

    return (
            <section id={"workspace"}>
                <div id={"viewer"}>
                    {Array.from(new Array(numPages), (_, index) => (
                        <div
                            ref={(el) => {
                                viewerPageRefs.current[index] = el; // Assign the element to the ref array
                            }}
                            key={`page_${index}`
                            }
                            className={'viewer-page'}
                        >
                            <canvas
                                className={'viewer-page-canvas'}
                            />
                            <div
                                className={'textLayer viewer-page-text'}
                            ></div>
                        </div>
                    ))}
                </div>
                <div id={"noteboard"}></div>
            </section>
    );
};


function addPostIt() {

}

export default PDFViewer;
