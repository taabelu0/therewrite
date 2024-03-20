import {api} from "./config/axiosConfig"

export const commentAPI = {
    createComment: async function (annotationId, userId, commentText) {
        const comment = {
            annotationId: {
                idAnnotation: annotationId
            },
            commentText: commentText
        };
        return api.post(`/api/comment`, comment)
            .then(response => response.data)
            .catch((error) => {
                console.error('Error:', error);
            });
    },

    getComments: async function (annotationId) {
        const response = await api.request({
            url: `/api/comment/all/${annotationId}`,
            method: "GET",
        });
        return response.data
    },
}