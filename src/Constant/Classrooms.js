import axios from "axios";

const Http = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    accept: "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});

async function testGetClass() {
  let id = "";
  let data = await getClass(id);

  data = JSON.stringify(data, null, "\t");
  console.log(data);
}

async function testAddClass() {
  let newClass = {
    address: "New Address",
    note: "This is a new class.",
    status: "normal",
    lastUsed: "2024-06-19",
    facilityAmount: 30,
  };
  addNewClass(newClass);
}

async function testRenewClass() {
  let renewData = {
    id: "class_id",
    address: "Updated Address",
    note: "This is an updated class.",
    status: "normal",
    lastUsed: "2024-06-20",
    facilityAmount: 35,
  };
  renewClass(renewData);
}

async function testRemoveClass() {
  let id = "class_id";
  removeClass(id);
}

async function getClass(id) {
  let response = await Http.get(`/api/v1/classroom/${id}`);
  return response.data.data;
}

async function getClassList(page = 1, limit = 1000) {
  let allClasses = [];
  let hasMore = true;

  while (hasMore) {
    let response = await Http.get(`/api/v1/classroom`, {
      params: { page, limit },
    });
    let data = response.data.data;
    allClasses = [...allClasses, ...data];

    hasMore = data.length === limit;
    if (hasMore) {
      page++;
    }
  }

  return allClasses;
}

async function addNewClass(newClass) {
  let res;

  await Http.post(`/api/v1/classroom`, JSON.stringify(newClass), {
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

  await Http.put(`/api/v1/classroom/${data.id}`, JSON.stringify(data), {
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

async function removeClass(id) {
  await Http.delete(`${process.env.REACT_APP_API_URL}/api/v1/classroom/${id}`)
    .then((response) => {
      console.log(`Response: ${response}`);
      console.log(`Status code: ${response.status}`);
    })
    .catch((err) => console.log(err));
}

async function getSuggestion(id) {
  let response = await Http.get(`/api/v1/suggest?Id=${id}`);
  return response.data.data;
}

// Test các hàm
// testGetClass();
// testAddClass();
// testRenewClass();
// testRemoveClass();
// (async () => {
//   const classes = await getClassList();
//   console.log(classes);
// })();

export {
  getClass,
  getClassList,
  addNewClass,
  renewClass,
  removeClass,
  getSuggestion,
};
