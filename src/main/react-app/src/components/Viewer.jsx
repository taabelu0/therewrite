import React, { useState, useRef, useEffect } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import PostIt from "./annotations/PostIt";
import { useParams } from "react-router-dom";
import '../style/basic.css';
import '../style/list.css';
import '../style/viewer.scss';

GlobalWorkerOptions.workerSrc = "/script/pdf.worker.4.0.min.js";

const PDFViewer = function () {
    const [numPages, setNumPages] = useState(null);
    const [pdf, setPDF] = useState(null);
    const [creatingPostIt, setCreatingPostIt] = useState(false);
    const [selectedColor, setSelectedColor] = useState("green");
    const canvasRefs = useRef([]);
    const [postIts, setPostIts] = useState([]);
    let { pdfName } = useParams();
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
                renderPage(pdf, pageNumber, canvasRefs.current[pageNumber - 1]).finally();
            }
            setPDF(null);
        }
    }, [pdf, postIts]);

    function renderPage(_pdf, pageNumber) {
        return _pdf.getPage(pageNumber).then(page => {
            const canvas = canvasRefs.current[pageNumber - 1];
            if (!canvas) {
                console.error(`Canvas for page ${pageNumber} is not initialized.`);
                return;
            }
            const scale = 1;
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

    function handleDocumentMouseDown(event) {
        if (creatingPostIt) {
            const { clientX, clientY } = event;
            const noteboard = document.getElementById("noteboard");
            const rect = noteboard.getBoundingClientRect();

            const x = clientX - rect.left;
            const y = clientY - rect.top;

            addPostIt(selectedColor, x, y);

            setCreatingPostIt(false);
        }
    }


    useEffect(() => {
        if (creatingPostIt) {
            document.addEventListener("mousedown", handleDocumentMouseDown);
        } else {
            document.removeEventListener("mousedown", handleDocumentMouseDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleDocumentMouseDown);
        };
    }, [creatingPostIt, selectedColor]);


    function addPostIt(color, x, y) {
        const newPostIt = {
            color: color,
            top: y,
            left: x,
            text: "New Post-It",
        };

        setPostIts([...postIts, newPostIt]);
    }

    function handleButtonClick(color) {
        setSelectedColor(color);
        setCreatingPostIt(true);
    }

    return (
        <section id={"workspace"}>
            <nav id="toolbar">
                <div className="tool add-post-it" id="add-post-it-green" onClick={() => handleButtonClick("green")}>+</div>
                <div className="tool add-post-it" id="add-post-it-yellow" onClick={() => handleButtonClick("yellow")}>+</div>
                <div className="tool add-post-it" id="add-post-it-red" onClick={() => handleButtonClick("red")}>+</div>
            </nav>
            <div id={"viewer"}>
                {Array.from(new Array(numPages), (_, index) => (
                    <canvas

                        // ... (other canvas properties)
                    />
                ))}
            </div>
            <div id={"noteboard"}>
                {postIts.map((postIt, index) => (
                    <PostIt
                        key={`postIt_${index}`}
                        color={postIt.color}
                        top={postIt.top}
                        left={postIt.left}
                        text={postIt.text}
                    />
                ))}
            </div>
        </section>
    );
};

export default PDFViewer;
