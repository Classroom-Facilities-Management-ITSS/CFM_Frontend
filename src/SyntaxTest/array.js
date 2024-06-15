const axios = require("axios");

const Http = axios.create({
  baseURL: "https://809b-2402-800-6d3e-a0b4-bd2d-14f1-871e-538e.ngrok-free.app",
  headers: {
    accept: "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});

async function addNewClass(newClass) {
  let res;

  await axios
    .post(`https://809b-2402-800-6d3e-a0b4-bd2d-14f1-871e-538e.ngrok-free.app/api/v1/classroom`, newClass, {
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

async function testAddClass() {
  let newClass = {
    address: "A-320",
    note: "This is a new class.",
    status: "OPEN",
    lastUsed: "2024-06-19",
    facilityAmount: 30,
  };
  addNewClass(newClass);
}

testAddClass();