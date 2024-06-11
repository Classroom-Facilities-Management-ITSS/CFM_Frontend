const { time } = require("console");
var fs = require("fs");

// Function to generate a random integer within a range (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random date and time (replace with your specific logic)
function getRandomDate() {
  // You can use a date library like moment.js or define your own logic here
  // This example generates a random date within the current year
  const year = new Date().getFullYear();
  const month = randomInt(1, 12);
  const randomDay = randomInt(1, 365); // Adjust for leap years if needed

  return new Date(year, month, randomDay); // Adjust month and day logic if desired
}

function createUserClassroomArray(numObjects = 50) {
  // Validate input (optional)
  if (
    typeof numObjects !== "number" ||
    numObjects <= 0 ||
    Math.floor(numObjects) !== numObjects
  ) {
    throw new Error("numObjects must be a positive integer");
  }

  const userClassroom = [];
  const usedClassrooms = new Set(); // Set to store used classIDs per user

  for (let i = 0; i < numObjects; i++) {
    let uniqueId, userId, classroomId;

    do {
      // Generate unique ID
      uniqueId = Math.floor(Math.random() * 100) + 1;
    } while (userClassroom.some((obj) => obj.id === uniqueId)); // Check for duplicate ID

    do {
      // Generate random user ID
      userId = Math.floor(Math.random() * 10) + 1;
      // Generate random classroom ID (excluding used ones for this user)
      classroomId = Math.floor(Math.random() * 50) + 1;
    } while (usedClassrooms.has(userId + "-" + classroomId)); // Check for duplicate class for user

    usedClassrooms.add(userId + "-" + classroomId); // Add used class for this user

    const randomDate = getRandomDate();

    userClassroom.push({ id: uniqueId, userId, classroomId, time: randomDate });
  }

  return userClassroom;
}

// Example usage
const userClassroom = createUserClassroomArray();
var json = JSON.stringify(userClassroom, null, "\t");
fs.writeFile(
  "C:/Users/admin/OneDrive/Documents/VisualStudio2019/Js/ES6/React/ClassManager/class-manager/src/Constant/schedule.json",
  json,
  "utf-8",
  function (err) {
    if (err) {
      throw err;
    }
    console.log("Saved!");
  }
);
