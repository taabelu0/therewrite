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
    },
    updateDocument: async function (documentId, source, copyRight) {
        return api.request({
            url: `/api/document/${documentId}`,
            method: "PATCH",
            data: {
                source,
                copyRight
            }
        });
    },
    getDocument: async function (documentId) {
        const response = await api.request({
            url: `/api/document/get/${documentId}`,
            method: "GET",
        })
        return response.data
    },
}