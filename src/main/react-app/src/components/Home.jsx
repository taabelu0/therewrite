import '../style/basic.scss';
import '../style/list.scss';
import '../style/customDropZone.min.scss';
import {useEffect, useRef, useState} from "react";
import {pdfAPI} from "../apis/pdfAPI";
import {csrfInterceptor} from "../apis/config/axiosConfig";
import {baseURL} from "../apis/config/axiosConfig";
import { Dropzone } from "dropzone";
import {accessTokenAPI} from "../apis/accessTokenAPI";


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

    const dropzoneInterceptor = (obj, xhr) => {
        let csrfObj = csrfInterceptor({headers: {}}).headers;
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
            setTimeout(() => {
                myDropzone.removeAllFiles();
                let pdf = response;
                setPdfs(prevState => [...prevState, pdf]);
                displayInviteLink(pdf);
            }, 1200);
        });
    }

    function displayInviteLink(pdf) {
        accessTokenAPI.create(pdf.id).then(token => {
            let url = window.location.origin + "/view/" + pdf.id + "?documentAccessToken=" + token;
            //alert(url);
            window.location.href = url;
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