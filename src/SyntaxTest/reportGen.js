var fs = require("fs");

const classes = require("../Constant/classroom.json");

function generateUniqueID() {
  let id;
  do {
    id = Math.floor(Math.random() * 10); // Generate a random integer
  } while (usedIDs.includes(id)); // Check if ID is already used
  usedIDs.push(id);

  return id;
}

function generateReport() {
  const id = generateUniqueID();

  // Filter classrooms with non-normal status
  const availableClassrooms = classes.filter(
    (classroom) => classroom.status != "normal"
  );
  // Ensure classID belongs to a non-normal classroom
  if (availableClassrooms.length === 0) {
    return null; // Skip report if no non-normal classrooms
  }
  const classIndex = Math.floor(Math.random() * availableClassrooms.length); // Random class ID (1-50)
  const chosenClassroom = availableClassrooms[classIndex];
  const classID = chosenClassroom.id;

  let userID = Math.floor(Math.random() * 5) + 6;
  const classUserIDSet = new Set(usedClassUserIDs[classID] || []); // Get existing user IDs for class

  do {
    userID = Math.floor(Math.random() * 5) + 6; // Random user ID (6-10)
  } while (classUserIDSet.has(userID)); // Check if user ID is unique within the class
  classUserIDSet.add(userID); // Add new user ID to the set for future checks
  usedClassUserIDs[classID] = Array.from(classUserIDSet); // Update used user IDs

  const note = `Class ${chosenClassroom.address} has broken device(s).`;

  return { id, classID, userID, note };
}

const report = [];
const usedIDs = [];
const usedClassUserIDs = {}; // Keep track of used user IDs for each class

// Generate a desired number of reports (adjust as needed)
for (let i = 0; i < 10; i++) {
  report.push(generateReport());
}

var json = JSON.stringify(report, null, "\t");
fs.writeFile(
  "C:/Users/admin/OneDrive/Documents/VisualStudio2019/Js/ES6/React/ClassManager/class-manager/src/Constant/report.json",
  json,
  "utf-8",
  function (err) {
    if (err) {
      throw err;
    }
    console.log("Saved!");
  }
);
