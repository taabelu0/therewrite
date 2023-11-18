import '../style/basic.css';
import '../style/list.css';
import '../style/viewer.scss';
import './annotations/PostIt.jsx';
import {useParams} from "react-router-dom";
import {useState, useRef, useEffect} from 'react';
import {GlobalWorkerOptions, getDocument} from 'pdfjs-dist';
GlobalWorkerOptions.workerSrc = "/script/pdf.worker.4.0.min.js";

const PDFViewer = function () {
    const [numPages, setNumPages] = useState(null);
    const [pdf, setPDF] = useState(null);
    const canvasRefs = useRef([]);
    let {pdfName} = useParams();
    let file = '/pdf/get/' + pdfName;


    useEffect(() => {
        const loadingTask = getDocument(file);
        loadingTask.promise.then(_pdf => {
            canvasRefs.current = new Array(_pdf.numPages);
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
            const canvas = canvasRefs.current[pageNumber - 1];
            if (!canvas) {
                console.error(`Canvas for page ${pageNumber} is not initialized.`);
                return;
            }
            const scale = 1.8;
            const viewport = page.getViewport({ scale });
            let outputScale = window.devicePixelRatio || 1;

            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);

            let transform = outputScale !== 1
                ? [outputScale, 0, 0, outputScale, 0, 0]
                : null;

            const renderContext = {
                canvasContext: canvas.getContext('2d'),
                viewport,
                transform
            };
            return page.render(renderContext).promise;
        });
    };

    return (
        <div id={"workspace-scroll"}>
            <section id={"workspace"}>
                <div id={"viewer"}>
                    {Array.from(new Array(numPages), (_, index) => (
                        <canvas
                            ref={(el) => {
                                canvasRefs.current[index] = el; // Assign the element to the ref array
                            }}
                            key={`canvas_${index}`
                            }
                        />
                    ))}
                </div>
                <div id={"noteboard"}></div>
            </section>
        </div>
    );
};


function addPostIt() {

}

export default PDFViewer;
