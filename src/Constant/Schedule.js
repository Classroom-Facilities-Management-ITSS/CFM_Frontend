import axios, * as others from "axios";

let token = JSON.parse(localStorage.getItem("token"));
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

async function getSchedule(id) {
  let response = await Http.get(`/api/v1/schedule/${id}`);
  response = response.data.data;

  response["userId"] = response["accountId"];
  response["time"] =
    "From: " + response["startTime"] + "\n" + "To: " + response["endTime"];

  delete response["accountId"];

  return response;
}

async function getScheduleList() {
  let page = 1;
  let limit = 50;
  let listData = [];
  let hasMore = true;

  while (hasMore) {
    let schedule = [];

    let response = await Http.get(`/api/v1/schedule`, {
      params: { page, limit },
    });
    let data = response.data.data;

    data.map((elem) => {
      elem["userId"] = elem["accountId"];
      elem["time"] =
        "From: " + elem["startTime"] + "\n" + "To: " + elem["endTime"];

      delete elem["accountId"];

      schedule = [...schedule, elem];
    });

    if (data.length == limit) {
      page += 1;
      listData.push(...data);
    } else {
      hasMore = false;
      listData.push(...data);
    }
  }

  return listData;
}

async function getScheduleByEmail(email) {
  let page = 1;
  let limit = 50;
  let listData = [];
  let hasMore = true;

  while (hasMore) {
    let schedule = [];

    let response = await Http.get(`/api/v1/schedule/search?Email=${email}`, {
      params: { page, limit },
    });
    let data = response.data.data;

    data.map((elem) => {
      elem["userId"] = elem["accountId"];
      elem["time"] =
        "From: " + elem["startTime"] + "\n" + "To: " + elem["endTime"];

      delete elem["accountId"];

      schedule = [...schedule, elem];
    });

    if (data.length == limit) {
      page += 1;
      listData.push(...data);
    } else {
      hasMore = false;
      listData.push(...data);
    }
  }

  return listData;
}

async function addNewSchedule(newSchedule) {
  let res;

  await axios
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
      res = response;
    })
    .catch((err) => {
      res = err;
    });

  return res;
}

async function renewSchedule(data) {
  let res;

  await axios
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
      res = response;
    })
    .catch((err) => {
      res = err;
    });

  return res;
}

async function removeSchedule(id) {
  let res;

  await axios
    .delete(`${process.env.REACT_APP_API_URL}/api/v1/schedule/${id}`)
    .then((response) => {
      res = response;
    })
    .catch((err) => {
      res = err;
    });

  return res;
}

async function getUserSchedule(token) {
  let response = await Http.get(`/api/v1/profile/schedule`);
  response = response.data.data;

  response["userId"] = response["accountId"];
  response["time"] =
    "From: " + response["startTime"] + "\n" + "To: " + response["endTime"];

  delete response["accountId"];

  return response;
}

export {
  getSchedule,
  getScheduleList,
  getScheduleByEmail,
  addNewSchedule,
  renewSchedule,
  removeSchedule,
  getUserSchedule,
};
