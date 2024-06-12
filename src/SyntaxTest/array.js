const axios = require("axios");

const REACT_APP_API_URL = "https://8467-58-187-77-68.ngrok-free.app/api/v1/";

let id = "455d91a5-9528-42c4-9249-08dc892ec974";

async function getAcc(id) {
  var response = await axios.get(`${REACT_APP_API_URL}account/${id}`);
  var data = response;
  console.log(data.data.data);

  return data.data;
}

getAcc(id);
