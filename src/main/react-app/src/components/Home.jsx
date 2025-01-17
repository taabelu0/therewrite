import '../style/basic.scss';
import '../style/list.scss';
import '../style/customDropZone.min.scss';
import {useEffect, useRef, useState} from "react";
import {pdfAPI} from "../apis/pdfAPI";
import {csrfInterceptor} from "../apis/config/axiosConfig";
import {baseURL} from "../apis/config/axiosConfig";
import { Dropzone } from "dropzone";
import {accessTokenAPI} from "../apis/accessTokenAPI";
import {SourcePopUp} from './SourcePopUp';

function Home() {
    const [pdfs, setPdfs] = useState([["", ""]]);
    const [showDetailsPopUp, setShowDetailsPopUp] = useState(false);
    const [currentPdf, setCurrentPdf] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const resp = await pdfAPI.getList().catch(e => { setPdfs([]) });
            if (resp) setPdfs(resp);
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

    const dropzoneInterceptor = (obj, xhr) => {
        let csrfObj = csrfInterceptor({ headers: {} }).headers;
        xhr.setRequestHeader('X-XSRF-TOKEN', csrfObj['X-XSRF-TOKEN']);
    };

    function registerDropzone(id) {
        let myDropzone = new Dropzone(id, {
            url: baseURL + "/api/document",
            method: "POST",
            enctype: "multipart/form-data",
            paramName: "file",
            sending: dropzoneInterceptor,
            sendingmultiple: dropzoneInterceptor
        });

        myDropzone.on("success", function (file, response) {
            let pdf = response;
            setPdfs(prevPdfs => [...prevPdfs, pdf]);
            setCurrentPdf(pdf);
            setShowDetailsPopUp(true);
        });
    }

    function handleDetailsSubmission(source, copyRight) {
        console.log(source, copyRight);
        setShowDetailsPopUp(false);

        pdfAPI.updateDocument(currentPdf.id, source, copyRight)
            .then(() => {
                window.location.href =  window.location.origin + "/view/" + currentPdf.id;
            })
            .catch(error => {
                console.error('Error updating document:', error);
            });

    }

    return (
        <section id="content">
            <div className="App">
                <form id="fileUpload" className="dropzone-custom">Drag & Drop your file here</form>
                <div className="list-container" id="list-of-pdf">
                    {pdfs.map((pdf, index) => <PDF key={index} pdf={pdf} />)}
                </div>
                {showDetailsPopUp && <SourcePopUp currentPdf={currentPdf} onClose={handleDetailsSubmission} />}
            </div>
        </section>
    );
}

function PDF({ pdf }) {
    return (
        <a href={"/view/" + pdf.id} className="list-item">
            {pdf.documentName}
        </a>
    );
}

export default Home;
