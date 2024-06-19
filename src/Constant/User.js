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

async function getAcc(id) {
  let response = await Http.get(`/api/v1/account/${id}`);
  response = response.data.data;

  let dob = response.user.dob ? response.user.dob.split("T")[0] : "0001-01-01";
  let profile = {
    accountID: response.id,
    avatar: response.user.avatar,
    fullName: response.user.fullName ? response.user.fullName : "No name",
    lastName: response.user.lastName ? response.user.lastName : "No name",
    firstName: response.user.firstName ? response.user.firstName : "No name",
    dob: dob,
    department: response.user.department
      ? response.user.department
      : "No department",
    account: {
      id: response.id,
      role: response.role,
      email: response.email,
      active: response.active,
    },
  };
  return profile;
}

async function getAccByEmail(email) {
  let response = await Http.get(`/api/v1/account/search?Email=${email}`);
  response = response.data.data;

  let dob = response.user.dob ? response.user.dob.split("T")[0] : "0001-01-01";
  let profile = {
    accountID: response.id,
    avatar: response.user.avatar,
    fullName: response.user.fullName ? response.user.fullName : "No name",
    lastName: response.user.lastName ? response.user.lastName : "No name",
    firstName: response.user.firstName ? response.user.firstName : "No name",
    dob: dob,
    department: response.user.department
      ? response.user.department
      : "No department",
    account: {
      id: response.id,
      role: response.role,
      email: response.email,
      active: response.active,
    },
  };
  return profile;
}

async function getAccList() {
  let page = 1;
  let limit = 10;
  let listData = [];
  let hasMore = true;

  while (hasMore) {
    let Accs = [];

    let response = await Http.get(`/api/v1/account`, {
      params: { page, limit },
    });
    response = response.data.data;

    response.map((elem) => {
      let dob = elem.user.dob ? elem.user.dob.split("T")[0] : "0001-01-01";
      let acc = {
        accountID: elem.id,
        avatar: elem.user.avatar,
        fullName: elem.user.fullName ? elem.user.fullName : "No name",
        lastName: elem.user.lastName ? elem.user.lastName : "No name",
        firstName: elem.user.firstName ? elem.user.firstName : "No name",
        dob: dob,
        department: elem.user.department
          ? elem.user.department
          : "No department",
        account: {
          id: elem.id,
          role: elem.role,
          email: elem.email,
          active: elem.active,
        },
      };

      Accs = [...Accs, acc];
    });

    if (response.length == limit) {
      page += 1;
      listData.push(...Accs);
    } else {
      hasMore = false;
      listData.push(...Accs);
    }
  }

  return listData;
}

async function addNewAcc(newAcc) {
  let res = {};

  await axios
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
      res = response;
    })
    .catch((err) => {
      console.log(err);
      res = err;
    });

  return res;
}

async function renewAcc(data) {
  let res;

  await axios
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
      res = response;
    })
    .catch((err) => {
      res = err;
    });

  return res;
}

async function removeAcc(id) {
  let res;

  await axios
    .delete(`${process.env.REACT_APP_API_URL}/api/v1/account/${id}`)
    .then((response) => {
      res = response;
    })
    .catch((err) => {
      res = err;
    });

  return res;
}

async function getProfile(token) {
  let response = await Http.get(`/api/v1/profile`, {
    headers: { Authorization: `bearer ` + token.accessToken },
  });
  response = response.data.data;

  let dob = response.user.dob ? response.user.dob.split("T")[0] : "0001-01-01";
  let profile = {
    accountID: response.id,
    avatar: response.user.avatar,
    fullName: response.user.fullName ? response.user.fullName : "No name",
    lastName: response.user.lastName ? response.user.lastName : "No name",
    firstName: response.user.firstName ? response.user.firstName : "No name",
    dob: dob,
    department: response.user.department
      ? response.user.department
      : "No department",
    account: {
      id: response.id,
      role: response.role,
      email: response.email,
      active: response.active,
    },
  };
  return profile;
}

async function renewProfile(data) {
  let res;

  await axios
    .put(
      `${process.env.REACT_APP_API_URL}/api/v1/profile`,
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

async function forgetPassword(data) {
  let res;

  await axios
    .post(
      `${process.env.REACT_APP_API_URL}/api/v1/auth/forgot_password`,
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

async function updatePassword(data) {
  let res;

  await axios
    .put(
      `${process.env.REACT_APP_API_URL}/api/v1/auth/update_password`,
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

async function activeAccount(token) {
  let res;

  await Http.put(
    `/api/v1/auth/active`,
    {},
    {
      headers: {
        Authorization: token,
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

export {
  getAcc,
  getAccList,
  getAccByEmail,
  addNewAcc,
  renewAcc,
  removeAcc,
  getProfile,
  renewProfile,
  forgetPassword,
  updatePassword,
  activeAccount,
};
