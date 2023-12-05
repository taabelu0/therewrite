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
    updateAnnotationDetails: function (id, x, y, text, type, category) {
        const annotation = {
            documentId: id,
            annotationText: text,
            annotationDetail: JSON.stringify({"text": text,
                "color": "",
                "dataX": x,
                "dataY": y,
                "annotation": type,
                "category": category
            })
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
            annotationText: text,
            documentId: id
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