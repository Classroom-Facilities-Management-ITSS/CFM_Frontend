import axios from "axios";

const BASE_URL = 'https://8467-58-187-77-68.ngrok-free.app/api/v1/';
var token = JSON.parse(localStorage.getItem("token"));
if(token) axios.defaults.headers.common['Authorization'] = token.accessToken;
const Http = axios.create({
    baseURL: BASE_URL,
});

export const AuthLogin = (data, config) => Http.post(BASE_URL + "auth/sign_in", data, config);