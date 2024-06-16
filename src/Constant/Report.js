import axios, * as others from "axios";

var token = JSON.parse(localStorage.getItem("token"));
if (token) {
  axios.defaults.headers.common["Authorization"] =
    `bearer ` + token.accessToken;
}

const Http = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    accept: "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});

async function getReport(id) {
  let response = await Http.get(`/api/v1/report/${id}`);
  return response.data.data;
}

async function getReportList() {
  let response = await Http.get(`/api/v1/report`);
  return response.data.data;
}

async function addNewReport(newReport) {
  let res;

  await axios
    .post(
      `${process.env.REACT_APP_API_URL}/api/v1/report`,
      JSON.stringify(newReport),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      res = response;
    })
    .catch((err) => {
      res = err;
    });

  return res;
}

export { getReport, getReportList, addNewReport };