import {api} from "./config/axiosConfig"

export const userAPI = {
    createUser: async function (username, email, password) {
        const user = {
            username: username,
            email: email,
            password: password
        };
        return api.post(`/api/user`, user)
            .then(response => { return response })
            .catch((error) => {
                console.error('Error:', error);
            });
    },

    getUser: async function (userId) {
        return await api.request({
            url: `/api/user/${userId}`,
            method: "GET",
        });
    },

    login: async function (email, password) {
        const user = {
            email: email,
            password: password
        };
        return api.post(`/api/user/login`, user)
            .then(response => { return response })
            .catch((error) => {
                console.error('Error:', error);
            });
    },
}