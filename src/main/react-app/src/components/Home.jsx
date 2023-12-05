import '../style/basic.scss';
import '../style/list.scss';
import '../style/customDropZone.min.scss';
import {useEffect, useRef, useState} from "react";
import {pdfAPI} from "../apis/pdfAPI";
import {baseURL} from "../apis/config/axiosConfig";

function Home() {

    const [pdfs, setPdfs] = useState([["", ""]]);
    useEffect(() => {
        async function fetchData() {
            const resp = await pdfAPI.getList().catch(e => { setPdfs({})});
            if(resp) setPdfs(resp);
        }

        fetchData().finally();
    }, []);


    const loaded = useRef(false);
    useEffect(() => {
        if (!loaded.current && window.Dropzone && window.registerDropzone) {
            loaded.current = true;
            window.registerDropzone("#fileUpload", window.Dropzone, baseURL);
        }
    }, []);

    return (
        <section id="content">
            <div className="App">
                <form id="fileUpload" className="dropzone-custom">Drag & Drop your file here</form>

                <div className="list-container" id="list-of-pdf">
                    {pdfs.map((pdf, index) => (
                        <a key={index} href={"/view/" + pdf['id']} className="list-item">
                            {pdf['documentName']}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Home;