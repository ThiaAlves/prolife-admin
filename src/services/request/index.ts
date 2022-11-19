import axios from "axios";

const api = axios.create({
    baseURL: 'http://187.87.223.235:5000/api',
    //Resolvendo o problema de CORS
    headers: {
        'Access-Control-Allow-Origin': '*',
    }
});

export default api;
