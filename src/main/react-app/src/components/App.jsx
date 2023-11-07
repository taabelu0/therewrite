import '../css/App.css';
import getPDFList from "./api.js";
import {useEffect, useState} from "react";

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
            <form id="fileUpload" className="dropzone-custom">
                Drag & Drop your file here
            </form>

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

export default App;
