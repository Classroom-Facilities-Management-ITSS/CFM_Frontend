const fs = require("fs");
const reportData = require("../Constant/initialData/report.json");

reportData.map((report) => {
  report.finish = 0;
});

let inputData = JSON.stringify(reportData, null, "\t");

fs.writeFile(
  "C:/Users/admin/OneDrive/Documents/VisualStudio2019/Js/ES6/React/ClassManager/class-manager/src/Constant/report1.json",
  inputData,
  "utf-8",
  function (err) {
    if (err) {
      throw err;
    }
    console.log("Saved!");
  }
);
