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

const headers = {
  accept: "application/json",
  "ngrok-skip-browser-warning": "69420",
};

async function testGetSchedule() {
  let id = "c5c808e0-82e3-4773-237c-08dc822472c8";
  let data = await getSchedule(id);

  data = JSON.stringify(data, null, "\t");
  console.log(data);
}

async function testGetScheduleByEmail() {
  let email = "ama098540%40gmail.com";
  let data = await getScheduleByEmail(email);

  data = JSON.stringify(data, null, "\t");
  console.log(data);
}

async function testGetScheduleList() {
  let data = await getScheduleList();
  data = JSON.stringify(data, null, "\t");
  console.log(data);
}

async function testAddSchedule() {
  let newSchedule = {
    accountId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",    
    classroomId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    startTime: "2024-06-12T06:36:20.155Z",
    endTime: "2024-06-12T06:36:20.155Z",
    subject: "string",    
    countStudent: 0,
  };
  addNewSchedule(newSchedule);
}

async function testRenewSchedule() {
  let renewData = {
    id: "b0a6c630-b653-4521-12c4-08dc8215c167",
    email: "ama098540@gmail.com",
    password: "123456789",
  };
  renewAcc(renewData);
}

async function testRemoveSchedule() {
  let id = "455d91a5-9528-42c4-9249-08dc892ec974";
  removeSchedule(id);
}

async function getSchedule(id) {
  var response = await Http.get(`/api/v1/schedule/${id}`);
  response = response.data.data;

  response["userId"] = response["accountId"];
  response["time"] =
    "From: " + response["startTime"] + "\n" + "To: " + response["endTime"];

  delete response["accountId"];

  return response;
}

async function getScheduleList() {
  var response = await Http.get(`/api/v1/schedule`);
  var response = response.data.data;

  response["userId"] = response["accountId"];
  response["time"] =
    "From: " + response["startTime"] + "\n" + "To: " + response["endTime"];

  delete response["accountId"];

  return response;
}

async function getScheduleByEmail(email) {
  var response = await Http.get(`/api/v1/schedule/search?Email=${email}`);
  return response.data.data;
}

async function addNewSchedule(newSchedule) {
  axios
    .post(
      `${process.env.REACT_APP_API_URL}/api/v1/schedule`,
      JSON.stringify(newSchedule),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log(`Response: ${response}`);
      console.log(`Status code: ${response.status}`);
    })
    .catch((err) => console.log(err));
}

async function renewSchedule(data) {
  axios
    .put(
      `${process.env.REACT_APP_API_URL}/api/v1/schedule/${data.id}`,
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log(`Response: ${response}`);
      console.log(`Status code: ${response.status}`);
    })
    .catch((err) => console.log(err));
}

async function removeSchedule(id) {
  axios
    .delete(`${process.env.REACT_APP_API_URL}/api/v1/schedule/${id}`)
    .then((response) => {
      console.log(`Response: ${response}`);
      console.log(`Status code: ${response.status}`);
    })
    .catch((err) => console.log(err));
}

async function getUserSchedule(token) {
  var response = await Http.get(`/api/v1/profile/schedule`);
  response = response.data.data;

  response["userId"] = response["accountId"];
  response["time"] =
    "From: " + response["startTime"] + "\n" + "To: " + response["endTime"];

  delete response["accountId"];

  return response;
}

//testGetAcc();
//testGetAccList();
//testGetAccByEmail();
//testAddAcc();
//testRenewAcc();

export {
  getSchedule,
  getScheduleList,
  getScheduleByEmail,

  addNewSchedule,
  renewSchedule,
  removeSchedule,

  getUserSchedule,
};
