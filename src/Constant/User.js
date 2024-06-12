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

async function testGetAcc() {
  let id = "455d91a5-9528-42c4-9249-08dc892ec974";
  let data = await getAcc(id);

  data = JSON.stringify(data, null, "\t");
  console.log(data);
}

async function testGetAccByEmail() {
  let email = "ama098540%40gmail.com";
  let data = await getAccByEmail(email);

  data = JSON.stringify(data, null, "\t");
  console.log(data);
}

async function testGetAccList() {
  let data = await getAccList();
  data = JSON.stringify(data, null, "\t");
  console.log(data);
}

async function testAddAcc() {
  let newAcc = {
    email: "vos1rab3.jrm94uhbx8@example.com",
    password: "defghj123456",
  };
  addNewAcc(newAcc);
}

async function testRenewAcc() {
  let renewData = {
    id: "b0a6c630-b653-4521-12c4-08dc8215c167",
    email: "ama098540@gmail.com",
    password: "123456789",
  };
  renewAcc(renewData);
}

async function testRemoveAcc() {
  let id = "455d91a5-9528-42c4-9249-08dc892ec974";
  removeAcc(id);
}

async function getAcc(id) {
  var response = await Http.get(`/api/v1/account/${id}`);
  return response.data.data;
}

async function getAccByEmail(email) {
  var response = await Http.get(`/api/v1/account/search?Email=${email}`);
  return response.data.data;
}

async function getAccList() {
  var response = await Http.get(`/api/v1/account`);
  var response = response.data.data;

  let Accs = [];
  response.map((elem) => {
    let acc = {
      accountID: elem.id,
      avatar: elem.user.avatar,
      fullName: elem.user.fullName ? elem.user.fullName : "No name",
      lastName: elem.user.lastName ? elem.user.lastName : "No name",        
      firstName: elem.user.firstName ? elem.user.firstName : "No name",
      account: {
        id: elem.id,
        role: elem.role,
        email: elem.email,
        active: elem.active,
      },
    };

    Accs = [...Accs, acc];
  });

  return Accs;
}

async function addNewAcc(newAcc) {
  axios
    .post(
      `${process.env.REACT_APP_API_URL}/api/v1/account`,
      JSON.stringify(newAcc),
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

async function renewAcc(data) {
  axios
    .put(
      `${process.env.REACT_APP_API_URL}/api/v1/account/${data.id}`,
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

async function removeAcc(id) {
  axios
    .delete(`${process.env.REACT_APP_API_URL}/api/v1/account/${id}`)
    .then((response) => {
      console.log(`Response: ${response}`);
      console.log(`Status code: ${response.status}`);
    })
    .catch((err) => console.log(err));
}

async function getProfile(token) {
  var response = await Http.get(`/api/v1/profile`, {
    headers: { Authorization: `bearer ` + token.accessToken },
  });
  response = response.data.data;

  let profile = {
    accountID: response.id,
    avatar: response.user.avatar,
    fullName: response.user.fullName ? response.user.fullName : "No name",
    lastName: response.user.lastName ? response.user.lastName : "No name",        
    firstName: response.user.firstName ? response.user.firstName : "No name",
    account: {
      id: response.id,
      role: response.role,
      email: response.email,
      active: response.active,
    },
  };
  return profile;
}

//testGetAcc();
//testGetAccList();
//testGetAccByEmail();
//testAddAcc();
//testRenewAcc();

export {
  getAcc,
  getAccList,
  getAccByEmail,

  addNewAcc,
  renewAcc,
  removeAcc,

  getProfile,
};
