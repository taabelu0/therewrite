import {api, baseURL} from "./config/axiosConfig"

export const annotationAPI = {
    getList: async function (documentId) {
        const response = await api.request({
            url: `/api/annotation/all/${documentId}`,
            method: "GET",
        });
        return response.data
    },

    saveAnnotation: async function (annotationDetails, documentId) {
        const annotation = {
            annotationDetail: JSON.stringify(annotationDetails),
            document: {
                id: documentId
            }
        };
        return api.post(`/api/annotation`,
            annotation
        )
            .then(response => response.data)
            .catch((error) => {
                console.error('Error:', error);
            });
    },
    updateAnnotation: function (id, obj) {
        const annotation = {
            idAnnotation: id,
            ...obj
        };

        return api.patch(`/api/annotation`,
            annotation
        )
            .catch((error) => {
                console.error('Error:', error);
            });
    },
    getUrl() {
        return `${baseURL}/api/annotation/`;
    }
}