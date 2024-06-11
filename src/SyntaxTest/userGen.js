var fs = require("fs");

function generateRandomString(length) {
  // Function to generate a random string of specified length
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateEmail(firstName, lastName) {
  // Function to generate a unique email based on first and last name
  const domain = "@example.com";
  let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${domain}`;
  let counter = 1;
  while (emails.has(email)) {
    // Check for duplicate emails using a Set
    email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${counter++}${domain}`;
  }
  emails.add(email);
  return email;
}

const users = [];
const emails = new Set(); // Set to store unique email addresses

for (let i = 0; i < 10; i++) {
  const firstName = generateRandomString(8);
  const lastName = generateRandomString(10);
  const fullName = `${firstName} ${lastName}`;
  const avatar = generateRandomString(16);

  let accountID = Math.floor(Math.random() * 10) + 1; // Unique ID between 1 and 10
  while (users.find((user) => user.accountID === accountID)) {
    accountID = Math.floor(Math.random() * 10) + 1;
  }

  const role = Math.random() < 0.5 ? "admin" : "user"; // Randomly assign role

  const account = {
    id: accountID,
    email: generateEmail(firstName, lastName),
    role,
    active: Math.random() < 0.8, // Randomly set active status
  };

  users.push({
    firstName,
    lastName,
    fullName,
    avatar,
    accountID,
    account,
  });
}

var json = JSON.stringify(users, null, "\t");
fs.writeFile(
  "C:/Users/admin/OneDrive/Documents/VisualStudio2019/Js/ES6/React/ClassManager/class-manager/src/Constant/user.json",
  json,
  "utf-8",
  function (err) {
    if (err) {
      throw err;
    }
    console.log("Saved!");
  }
);
