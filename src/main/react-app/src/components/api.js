import axios from "axios";

const url = "http://localhost:8080";


export async function getPDFList() {
    try {
        let data = (await axios.get(url + "/pdf/list")).data;
        return data;
    } catch (exception) {
        // log exception
        return [];
    }
}
