import {api, baseURL} from "./config/axiosConfig"

export const pdfAPI = {
    getList: async function () {
        const response = await api.request({
            url: `/api/document/all`,
            method: "GET",
        })
        return response.data
    },
    get: async function (name) {
        const response = await api.request({
            url: `/api/document/${name}`,
            method: "GET",
        })
        return response.data
    },
    getUrl(pdfName) {
        return `${baseURL}/api/document/${pdfName}`;
    }
}