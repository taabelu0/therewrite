import {api, baseURL} from "./config/axiosConfig"

export const pdfAPI = {
    getList: async function () {
        const response = await api.request({
            url: `/pdf/list`,
            method: "GET",
        })
        return response.data
    },
    get: async function (name) {
        const response = await api.request({
            url: `/pdf/get/${name}`,
            method: "GET",
        })
        return response.data
    },
    getUrl(pdfName) {
        return `${baseURL}/pdf/get/${pdfName}`;
    }
}