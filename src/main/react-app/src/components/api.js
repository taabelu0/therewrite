import axios from "axios";

const url = "http://localhost:8080";


export async function getPDFList() {
    let data = (await axios.get(url + "/pdf/list")).data;
    return data;
}

export async function postPDF(file) {
    try {
        let formData = new FormData();
        formData.append("file", file);
        return (await axios.post(url + "/file/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }));
    } catch {
        // log
    }
}