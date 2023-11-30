import {api, baseURL} from "./config/axiosConfig"

export const annotationAPI = {
    getList: async function () {
        const response = await api.request({
            url: `/annotation/list`,
            method: "GET",
        })
        console.log(response);
        return response.data
    },
    savePostItPositionToDatabase: async function (postIt) {
        const annotation = {
            annotationType: "post-it",
            annotationDetail: JSON.stringify(postIt),
        };

        return await api.post('/annotation/save',
            annotation
        )
            .then(response => response.data)
            .catch((error) => {
                console.error('Error:', error);
            });
    },
    getUrl(id) {
        return `${baseURL}/annotation/get/${id}`;
    }
}