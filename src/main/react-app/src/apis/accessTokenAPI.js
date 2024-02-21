import {api, baseURL} from "./config/axiosConfig"

export const accessTokenAPI = {
    create: async function (documentId) {
        const document = {
            documentId: documentId
        };
        return api.post(`/api/documentAccessToken/create`,
            document
        )
            .then(response => response.data)
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}