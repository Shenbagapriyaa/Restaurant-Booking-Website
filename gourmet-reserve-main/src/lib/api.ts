import axios from "axios";

const api = axios.create({
    // Hardcode 5005 here to ensure it stops trying to use the 'undefined' env variable
    baseURL: "http://localhost:5005",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;