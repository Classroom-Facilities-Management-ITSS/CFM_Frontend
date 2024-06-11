var fs = require("fs");

const devices = [];
const classes = require("../Constant/classroom.json");

const arr = [];
function createIntegerArray(n) {
  for (let i = 0; i < n; i++) {
    arr.push(i + 1);
  }
  return arr;
}
const tabletLocation = [...arr];

function generateRandomId(min, max) {
  // Function to generate a random number within a range
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomName() {
  // Function to generate a random version (1, 2, or 3)
  const deviceName = [
    "Tablet",
    "Speakers",
    "Projector",
    "Laptop computer",
    "Document camera",
    "Interactive whiteboard",
  ];
  return deviceName[Math.floor(Math.random() * deviceName.length)];
}

function generateRandomVersion() {
  // Function to generate a random version (1, 2, or 3)
  const versions = [1, 2, 3];
  return versions[Math.floor(Math.random() * versions.length)];
}

function generateRandomCount(name) {
  // Function to generate a random integer
  if (name == "Laptop computer") {
    return Math.floor(Math.random() * 30) + 1; // Adjust the max value as needed
  }
  return Math.floor(Math.random() * 2) + 1; // Adjust the max value as needed
}

function generateRandomStatus() {
  // Function to generate a random device status
  const statuses = ["normal", "has broken device", "broken"];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function generateRandomLocation(count) {
  // Function to generate random location coordinates (x, y)
  const coordinates = createIntegerArray(count);
  return coordinates[Math.floor(Math.random() * coordinates.length)];
}

function generateRandomComment(status, count) {
  // Function to generate a random comment based on device status
  let comment;
  switch (status) {
    case "normal":
      comment = "This device is working well!";
      break;
    case "has broken device":
      comment = `Location of broken device: ${generateRandomLocation(count)}`;
      break;
    case "broken":
      comment = "Needs to be replaced immediately!";
      break;
    default:
      comment = "";
  }
  return comment;
}

// Generate 100 devices
const numDevices = 100;

for (let i = 0; i < numDevices; i++) {
  let uniqueId = generateRandomId(1, 1000); // Adjust ID range as needed
  // Ensure unique IDs by checking if it already exists
  while (devices.find((device) => device.id == uniqueId)) {
    uniqueId = generateRandomId(1, 1000);
  }

  const name = generateRandomName();
  const count = generateRandomCount(name);
  const status = generateRandomStatus();
  const version = generateRandomVersion();
  const comment = generateRandomComment(status, count);

  let validClassID = false;
  let randomClassroomIndex;
  while (!validClassID) {
    randomClassroomIndex = Math.floor(Math.random() * classes.length);
    const randomClassroom = classes[randomClassroomIndex];
    // Check if any existing device with the same name has this classID
    validClassID = !devices.some(
      (device) => device.name == name && device.classID == randomClassroom.id
    );
  }

  devices.push({
    id: uniqueId,
    name,
    version,
    count,
    status,
    note: comment,
    classID: classes[randomClassroomIndex].id
  });
}

var json = JSON.stringify(devices, null, "\t");
fs.writeFile(
  "C:/Users/admin/OneDrive/Documents/VisualStudio2019/Js/ES6/React/ClassManager/class-manager/src/Constant/device.json",
  json,
  "utf-8",
  function (err) {
    if (err) {
      throw err;
    }
    console.log("Saved!");
  }
);