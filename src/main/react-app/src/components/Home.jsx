import '../style/basic.scss';
import '../style/list.scss';
import '../style/customDropZone.min.scss';
import {useEffect, useRef, useState} from "react";
import {pdfAPI} from "../apis/pdfAPI";
import {baseURL} from "../apis/config/axiosConfig";
import { Dropzone } from "dropzone";


function Home() {

    const [pdfs, setPdfs] = useState([["", ""]]);
    useEffect(() => {
        async function fetchData() {
            const resp = await pdfAPI.getList().catch(e => { setPdfs( [])});
            if(resp) setPdfs(resp);
        }

        fetchData().finally();
    }, []);


    const loaded = useRef(false);
    useEffect(() => {
        if (!loaded.current && Dropzone) {
            loaded.current = true;
            registerDropzone("#fileUpload");
        }
    }, []);

    function registerDropzone(id) {
        let myDropzone = new Dropzone(id, {
            url: baseURL + "/api/document",
            method: "POST",
            enctype: "multipart/form-data",
            paramName: "file",
        });
        myDropzone.on("success", function (file, response) {
            setTimeout(() => {
                myDropzone.removeAllFiles();
                let pdf = response;
                setPdfs(prevState => [...prevState, pdf]);
            }, 1200);
        });
    }

    return (
        <section id="content">
            <div className="App">
                <form id="fileUpload" className="dropzone-custom">Drag & Drop your file here</form>

                <div className="list-container" id="list-of-pdf">
                    {pdfs.map(PDF)}
                </div>
            </div>
        </section>
    );
}

function PDF(pdf, index) {
    return(
    <a key={index} href={"/view/" + pdf['id']} className="list-item">
        {pdf['documentName']}
    </a>);
}

export default Home;