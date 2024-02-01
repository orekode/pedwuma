import axios from "axios";

export const base = "https://pedwuma.com/backend";

export const sendMessage = (email, number, message) => {
    let data = new FormData();

    data.append("email", email);
    data.append("number", number);
    data.append("message", message);

    return axios.post(`${base}/sendMessage`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}