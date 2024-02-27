import {api, baseURL} from "./config/axiosConfig"

export const annotationAPI = {
    getList: async function (documentId) {
        const response = await api.request({
            url: `/api/annotation/all/${documentId}`,
            method: "GET",
        });
        return response.data
    },

    saveAnnotation: async function (documentId, text, annotationDetails) {
        const annotation = {
            document: {
                id: documentId,
                annotationText: text
            },
            annotationDetail: JSON.stringify(annotationDetails)
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

    deleteAnnotation: async function (annotationId) {
        return api.delete(`/api/annotation/${annotationId}`)
            .then(response => response.data)
            .catch((error) => {
                console.error('Error:', error);
            });
    },

    getUrl() {
        return `${baseURL}/api/annotation/`;
    }
}