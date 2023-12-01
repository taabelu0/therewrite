import {api, baseURL} from "./config/axiosConfig"

export const annotationAPI = {
    getList: async function (documentId) {
        const response = await api.request({
            url: `/annotation/list/${documentId}`,
            method: "GET",
        });
        return response.data
    },

    saveAnnotation: async function (annotationDetails, documentId) {
        const annotation = {
            annotationDetail: JSON.stringify(annotationDetails),
        };
        return api.post(`/annotation/save/${documentId}`,
            annotation
        )
            .then(response => response.data)
            .catch((error) => {
                console.error('Error:', error);
            });
    },
    updateAnnotationDetails: function (id, x, y, color, text, type, category) {
        const annotation = {
            annotationText: text,
            annotationDetail: JSON.stringify({"text": text,
                "color": color,
                "dataX": x,
                "dataY": y,
                "annotation": type,
                "category": category
            })
        };

        return api.put(`/annotation/update/${id}`,
            annotation
        )
            .catch((error) => {
                console.error('Error:', error);
            });
    },
    updateAnnotationText: function (id, text) {
        const annotation = {
            annotationText: text,
        };

        return api.put(`/annotation/updateText/${id}`,
            annotation
        )
            .catch((error) => {
                console.error('Error:', error);
            });
    },
    getUrl(id) {
        return `${baseURL}/annotation/get/${id}`;
    }
}