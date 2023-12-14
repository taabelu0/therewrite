import '../style/basic.scss';
import '../style/list.scss';
import '../style/customDropZone.min.scss';
import {useEffect, useRef, useState} from "react";
import {pdfAPI} from "../apis/pdfAPI";
import {baseURL} from "../apis/config/axiosConfig";
import * as StompJs from "@stomp/stompjs";


function Websocket() {
    const stompClient = new StompJs.Client({
        brokerURL: 'ws://localhost:8080/ws'
    });

    stompClient.onConnect = (frame) => {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/msg', (message) => {
            console.log(JSON.parse(message.body));
        });
    };

    stompClient.onWebSocketError = (error) => {
        console.error('Error with websocket', error);
    };

    stompClient.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    function connect() {
        stompClient.activate();
    }

    function disconnect() {
        stompClient.deactivate().finally();
        console.log("Disconnected");
    }

    function sendMessage() {
        stompClient.publish({
            destination: "/app/hello",
            body: JSON.stringify({'message': 'HELLO THERE!'})
        });
    }

    return(<div>
        <button onClick={connect}>Connect</button>
        <button onClick={sendMessage}>Send</button>
        <button onClick={disconnect}>Disconnect</button>
    </div>)
}


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
        if (!loaded.current && window.Dropzone && window.registerDropzone) {
            loaded.current = true;
            window.registerDropzone("#fileUpload", window.Dropzone, baseURL);
        }
    }, []);

    return (
        <section id="content">
            <Websocket></Websocket>
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