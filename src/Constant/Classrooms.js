import axios, * as others from "axios";

const Http = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    accept: "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});

async function getClass(id) {
  let response = await Http.get(`/api/v1/classroom/${id}`);
  return response.data.data;
}

async function getClassList() {
  let page = 1;
  let limit = 10;
  let listData = [];
  let hasMore = true;

  while (hasMore) {
    let response = await Http.get(`/api/v1/classroom`, {
      params: { page, limit },
    });
    let data = response.data.data;

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

async function addNewClass(newClass) {
  let res;

  await axios
    .post(`${process.env.REACT_APP_API_URL}/api/v1/classroom`, newClass, {
      headers: {
        "Content-Type": "application/json",
      },
    })
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

async function renewClass(data) {
  let res;

  await axios
    .put(
      `${process.env.REACT_APP_API_URL}/api/v1/classroom/${data.id}`,
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
      res = response;
    })
    .catch((err) => {
      console.log(err);
      res = err;
    });

  return res;
}

async function removeClass(id) {
  let res;

  await axios
    .delete(`${process.env.REACT_APP_API_URL}/api/v1/classroom/${id}`)
    .then((response) => {
      res = response;
    })
    .catch((err) => {
      res = err;
    });

  return res;
}

async function getSuggestion(id) {
  let response = await Http.get(`/api/v1/suggest?Id=${id}`);
  return response.data.data;
}

async function changeClassroom(data) {
  let res;

  await axios
    .post(`${process.env.REACT_APP_API_URL}/api/v1/suggest`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      res = response;
    })
    .catch((err) => {
      res = err;
    });

  return res;
}

export {
  getClass,
  getClassList,
  addNewClass,
  renewClass,
  removeClass,
  getSuggestion,
  changeClassroom,
};
