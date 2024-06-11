var fs = require("fs");

const devices = require("../Constant/device.json");
const classrooms = [];

function generateRandomId(min, max) {
  // Function to generate a random number within a range
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomLetter() {
  // Function to generate a random letter from A to E
  const letters = ["A", "B", "C", "D", "E"];
  return letters[Math.floor(Math.random() * letters.length)];
}

function generateRandomNumber(min, max) {
  // Function to generate a random number within a range
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomDate(startDate, endDate) {
  // Function to generate a random date string within a date range
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = (end - start) / (1000 * 60 * 60 * 24);
  const randomDay = Math.floor(Math.random() * days);
  const date = new Date(start.getTime() + randomDay * (1000 * 60 * 60 * 24));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function generateRandomStatus() {
  // Function to generate a random device status
  const statuses = ["normal", "cannot be used"];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function generateRandomComment(status) {
  // Function to generate a comment based on classroom status
  let comment;
  if (status === "normal") {
    comment = "This classroom is available for use.";
  } else {
    comment = "This classroom is currently unavailable.";
  }
  return comment;
}

// Generate 50 classrooms
const numClassrooms = 50;

for (let i = 0; i < numClassrooms; i++) {
  let uniqueId = generateRandomId(1, 50);
  // Ensure unique IDs by checking if it already exists
  while (classrooms.find((classroom) => classroom.id === uniqueId)) {
    uniqueId = generateRandomId(1, 50);
  }

  let uniqueAddress = `${generateRandomLetter()}${generateRandomNumber(
    1,
    2
  )}0${generateRandomNumber(1, 5)}`;
  // Ensure unique addresses by checking if it already exists
  while (classrooms.find((classroom) => classroom.address === uniqueAddress)) {
    uniqueAddress = `${generateRandomLetter()}${generateRandomNumber(
      1,
      2
    )}0${generateRandomNumber(1, 5)}`;
  }

  const lastUsed = generateRandomDate(
    new Date(2024, 4, 1),
    new Date(2024, 5, 31)
  );
  const status = generateRandomStatus();
  const note = generateRandomComment(status);

  classrooms.push({
    id: uniqueId,
    address: uniqueAddress,
    lastUsed,
    status,
    note,
  });
}

// Calculate facilityAmount for each classroom
const classroomMap = {};
for (const device of devices) {
  const classID = device.classID;
  if (!classroomMap[classID]) {
    classroomMap[classID] = { id: classID, facilityAmount: 0 };
  }
  classroomMap[classID].facilityAmount += device.count;
}

// Update classrooms with facilityAmount
for (const classroom of classrooms) {
  const classData = classroomMap[classroom.id];
  if (classData) {
    classroom.facilityAmount = classData.facilityAmount;
  } else {
    classroom.facilityAmount = 0;
  }
}

var json = JSON.stringify(classrooms, null, "\t");
fs.writeFile(
  "C:/Users/admin/OneDrive/Documents/VisualStudio2019/Js/ES6/React/ClassManager/class-manager/src/Constant/classroom.json",
  json,
  "utf-8",
  function (err) {
    if (err) {
      throw err;
    }
    console.log("Saved!");
  }
);

