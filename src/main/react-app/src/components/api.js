import axios from "axios";

const url = process.env.API_URL;


export async function getPDFList() {
    try {
        let data = (await axios.get(url + "/pdf/list")).data;
        return data;
    } catch (exception) {
        // log exception
        return [];
    }
}
