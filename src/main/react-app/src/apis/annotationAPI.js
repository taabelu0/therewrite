import {api, baseURL} from "./config/axiosConfig"

export const annotationAPI = {
    getList: async function (documentId) {
        const response = await api.request({
            url: `/annotation/list/${documentId}`,
            method: "GET",
        })
        console.log(response);
        return response.data
    },

    savePostItPositionToDatabase: async function (postIt, documentId) {
        const annotation = {
            annotationType: "post-it",
            annotationDetail: JSON.stringify(postIt),
        };
        return api.post(`/annotation/save/${documentId}`,
            annotation
        )
            .then(response => response.data)
            .catch((error) => {
                console.error('Error:', error);
            });
    },
    updatePostItDetails: function (id, x, y, color, text) {
        const annotation = {
            annotationText: text,
            annotationDetail: JSON.stringify({"text": text, "color": color, "dataX": x, "dataY": y})
        };

        return api.put(`/annotation/update/${id}`,
            annotation
        )
            .catch((error) => {
                console.error('Error:', error);
            });
    },
    updatePostItText: function (id, text) {
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