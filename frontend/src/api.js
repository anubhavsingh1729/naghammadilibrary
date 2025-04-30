import axios from 'axios'

const api = axios.create({
    // baseURL: 'http://localhost:8000',
    baseURL:'https://naghammadilibrary.onrender.com',
})

export default api;