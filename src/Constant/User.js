const fs = require("fs");
const { json } = require("react-router-dom");

async function test() {
  let data = await getUserList();
  data = JSON.stringify(data, null, "\t");
  fs.writeFile(
    "C:/Users/admin/OneDrive/Documents/VisualStudio2019/Js/ES6/React/ClassManager/class-manager/src/Constant/fetchData/users.json",
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

async function testAddUser() {
    let data = await getUserList();
    data = JSON.stringify(data, null, "\t");
    fs.writeFile(
      "C:/Users/admin/OneDrive/Documents/VisualStudio2019/Js/ES6/React/ClassManager/class-manager/src/Constant/fetchData/users.json",
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

async function getUserList() {
  var response = await fetch(
    `https://7b93-27-72-100-200.ngrok-free.app/api/v1/account`
  );
  var data = await response.json();

  let Users = [];
  data.data.map((elem) => {
    let user = {
      id: elem.id,
      user: elem.user,
      role: elem.role,
      email: elem.email,
      active: elem.active,
    };

    Users = [...Users, user];
  });

  return Users;
}

async function addNewUser(newUser) {
  fetch(`https://7b93-27-72-100-200.ngrok-free.app/api/v1/account`, {
    method: "POST",
    body: JSON.stringify(newUser),
  })
    .then((res) => {
      res.json();
    })
    .then((json) => {
      console.log(json);
    })
    .catch((err) => console.log(err));
}

//test();

module.exports = { getUserList };
