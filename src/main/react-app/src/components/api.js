import axios from "axios";

async function getPDFList() {
   let data = (await axios.get("http://localhost:8080/pdf/list")).data;
   return data;
}

export default getPDFList;