import axios from "axios";

const BASE_URL = "https://760f-2402-800-6d3e-a0b4-103e-7312-48c5-3428.ngrok-free.app/api/v1";

var token = JSON.parse(localStorage.getItem("token"));
if (token)
  axios.defaults.headers.common["Authorization"] =
    `bearer ` + token.accessToken;

const Http = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    accept: "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});

export const AuthLogin = (data, config) =>
  Http.post(process.env.REACT_APP_API_URL + "/api/v1/auth/sign_in", data, config);
