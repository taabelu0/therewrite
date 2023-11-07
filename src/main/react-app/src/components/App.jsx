import '../style/App.css';
import '../style/basic.css';
import '../style/list.css';
import '../style/customDropZone.min.css';
import {getPDFList, postPDF} from "./api.js";
import {useEffect, useState} from "react";
import Dropzone from 'react-dropzone'

function App() {
    const [pdfs, setPdfs] = useState([["", ""]]);

    useEffect(() => {
        async function fetchData() {
            const resp = await getPDFList();
            setPdfs(resp);
        }
        fetchData().finally();
    }, []);


    return (
        <div className="App">
            <Dropzone onDrop={acceptedFiles => uploadPDF(acceptedFiles[0])}>
                {({getRootProps, getInputProps}) => (
                    <section>
                        <form className="dropzone-custom" {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Drag & Drop your file here</p>
                        </form>
                    </section>
                )}
            </Dropzone>

            <div className="list-container" id="list-of-pdf">
                {pdfs.map((pdf, index) => (
                    <a key={index} href={pdf[1]} className="list-item">
                        {pdf[0]}
                    </a>
                ))}
            </div>

        </div>
    );
}

function uploadPDF(file) {
    postPDF(file).finally();
    setTimeout( () => {
        window.location.reload()
    }, 600);
}

export default App;
