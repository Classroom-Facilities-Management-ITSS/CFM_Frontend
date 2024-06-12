const fs = require("fs");
const axios = require("axios");

async function testGetClass() {
  let id = "";
  let data = await getClass(id);

  data = JSON.stringify(data, null, "\t");
  console.log(data);
}

async function testGetClassList() {
  let data = await getClassList();
  data = JSON.stringify(data, null, "\t");
  fs.writeFile(
    "C:/Users/admin/OneDrive/Documents/VisualStudio2019/Js/ES6/React/ClassManager/class-manager/src/Constant/fetchData/classes.json",
    data,
    "utf-8",
    function (err) {
      if (err) {
        throw err;
      }
      console.log("Saved!");
    }
  );
}

async function testAddAcc() {
  let newAcc = {
    email: "ijp53w6q.7zrrb7rwcs@example.com",
    password: "defghj123456",
  };
  addNewAcc(newAcc);
}

async function testRenewAcc() {
  let renewData = {
    id: "",
    email: "",
    password: "",
  };
  renewAcc(renewData);
}

async function getClass(id) {
  var response = await fetch(
    `https://7b93-27-72-100-200.ngrok-free.app/api/v1/classroom/${id}`
  );
  var data = await response.json();

  return data.data;
}

async function getClassList() {
  var response = await fetch(
    `https://7b93-27-72-100-200.ngrok-free.app/api/v1/classroom`
  );
  var data = await response.json();

  let Classess = [];
  data.data.map((elem) => {
    let classroom = {
      id: elem.id,
      note: elem.note,
      status: elem.status,
      address: elem.address,
      lastUsed: elem.lastUsed,
      facilityAmount: elem.facilityAmount,
    };

    Classess = [...Classess, classroom];
  });

  return Classess;
}

async function addNewClass(newClass) {
  axios
    .post(
      `https://7b93-27-72-100-200.ngrok-free.app/api/v1/classroom`,
      JSON.stringify(newClass),
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

async function renewClass(data) {
  axios
    .put(
      `https://7b93-27-72-100-200.ngrok-free.app/api/v1/account/${data.id}`,
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

async function removeClass(id) {
  axios
    .delete(
      `https://7b93-27-72-100-200.ngrok-free.app/api/v1/account/${data.id}`
    )
    .then((response) => {
      console.log(`Response: ${response}`);
      console.log(`Status code: ${response.status}`);
    })
    .catch((err) => console.log(err));
}

//testGetAcc()
//testGetAccList();
//testAddAcc();

module.exports = { getAccList };
