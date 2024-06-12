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

async function addNewReport(newReport) {
  let res;

  axios
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
      console.log(`Response: ${response}`);
      console.log(`Status code: ${response.status}`);
      res = response;
    })
    .catch((err) => {
      console.log(err);
      res = err;
    });

    return res;
}

export { addNewReport };
