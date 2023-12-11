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
            documentId: documentId
        };
        return api.post(`/api/annotation`,
            annotation
        )
            .then(response => response.data)
            .catch((error) => {
                console.error('Error:', error);
            });
    },
    updateAnnotationDetails: function (id, x, y, text) {
        const annotation = {
            idAnnotation: id,
            annotationText: text
        };

        return api.patch(`/api/annotation`,
            annotation
        )
            .catch((error) => {
                console.error('Error:', error);
            });
    },
    updateAnnotationText: function (id, text) {
        const annotation = {
            idAnnotation: id,
            annotationText: text
        };

        return api.patch(`/api/annotation/`,
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