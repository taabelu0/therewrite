import '../style/basic.css';
import '../style/list.css';
import '../style/customDropZone.min.css';
import '../style/index.css';
import {useEffect, useRef, useState} from "react";
import {getPDFList} from "./api";

function Home() {

    const [pdfs, setPdfs] = useState([["", ""]]);
    useEffect(() => {
        async function fetchData() {
            const resp = await getPDFList();
            setPdfs(resp);
        }

        fetchData().finally();
    }, []);


    const loaded = useRef(false);
    useEffect(() => {
        if (!loaded.current && window.Dropzone && window.registerDropzone) {
            loaded.current = true;
            window.registerDropzone("#fileUpload", window.Dropzone);
        }
    }, []);

    return (
        <div className="App">
            <form id="fileUpload" className="dropzone-custom">Drag & Drop your file here</form>

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

export default Home;