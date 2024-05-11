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

    login: async function (username, password) {
        // const user = {
        //     email: email,
        //     password: password
        // };
        const fd = new FormData()
        fd.append('username', username);
        fd.append('password', password)
        return api.post(`/api/user/login`, fd, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(response => { return response })
            .catch((error) => {
                console.error('Error:', error);
            });
    },
}