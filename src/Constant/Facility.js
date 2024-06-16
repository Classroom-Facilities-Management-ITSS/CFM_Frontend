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

async function getFacility(id) {
  let response = await Http.get(`/api/v1/facility/${id}`);
  return response.data.data;
}

async function getFacilityByClassAddress(classAddress) {
  let page = 1;
  let limit = 10;
  let listData = [];
  let hasMore = true;

  while (hasMore) {
    let response = await Http.get(
      `/api/v1/facility/search?ClassroomAddress=${classAddress}`,
      {
        params: { page, limit },
      }
    );
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

async function getFacilityList() {
  let page = 1;
  let limit = 10;
  let listData = [];
  let hasMore = true;

  while (hasMore) {
    let response = await Http.get(`/api/v1/facility`, {
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

async function addNewFacility(newFaci) {
  let res;

  await axios
    .post(
      `${process.env.REACT_APP_API_URL}/api/v1/facility`,
      JSON.stringify(newFaci),
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

  return res;
}

async function renewFacility(data) {
  let res;

  await axios
    .put(
      `${process.env.REACT_APP_API_URL}/api/v1/facility/${data.id}`,
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

async function removeFacility(id) {
  let res;

  await axios
    .delete(`${process.env.REACT_APP_API_URL}/api/v1/facility/${id}`)
    .then((response) => {
      res = response;
    })
    .catch((err) => {
      res = err;
    });

  return res;
}

export {
  getFacility,
  getFacilityList,
  getFacilityByClassAddress,
  addNewFacility,
  renewFacility,
  removeFacility,
};
