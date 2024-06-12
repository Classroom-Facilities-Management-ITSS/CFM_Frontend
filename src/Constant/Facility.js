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

async function testGetFacility() {
  let id = "";
  let data = await getFacility(id);

  data = JSON.stringify(data, null, "\t");
  console.log(data);
}

async function testGetFacilityByAddress() {
  let address = "";
  let data = await getFacilityByClassAddress(address);

  data = JSON.stringify(data, null, "\t");
  console.log(data);
}

async function testGetFacilityList() {
  let data = await getFacilityList();
  data = JSON.stringify(data, null, "\t");
  console.log(data);
}

async function testAddFacility() {
  let newFacility = {};
  addNewFacility(newFacility);
}

async function testRenewFacility() {
  let renewData = {};
  renewAcc(renewData);
}

async function testRemoveFacility() {
  let id = "";
  removeFacility(id);
}

async function getFacility(id) {
  var response = await Http.get(`/api/v1/facility/${id}`);
  return response.data.data;
}

async function getFacilityByClassAddress(classAddress) {
  var response = await Http.get(
    `/api/v1/facility/search?ClassroomAddress=${classAddress}`
  );
  return response.data.data;
}

async function getFacilityList() {
  var response = await Http.get(`/api/v1/facility`);
  return response.data.data;
}

async function addNewFacility(newFaci) {
  axios
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
}

async function renewFacility(data) {
  axios
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
      console.log(`Response: ${response}`);
      console.log(`Status code: ${response.status}`);
    })
    .catch((err) => console.log(err));
}

async function removeFacility(id) {
  axios
    .delete(`${process.env.REACT_APP_API_URL}/api/v1/facility/${id}`)
    .then((response) => {
      console.log(`Response: ${response}`);
      console.log(`Status code: ${response.status}`);
    })
    .catch((err) => console.log(err));
}

//testGetFacility();
//testGetFacilityList();
//testGetFacilityByAddress();
//testAddFacility();
//testRenewFacility();
//testRemoveFacility();

export {
  getFacility,
  getFacilityList,
  getFacilityByClassAddress,
  addNewFacility,
  renewFacility,
  removeFacility,
};
