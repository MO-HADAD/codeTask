const fs = require("fs");
const path = require("path");

function convertConfigToJson(configContent) {
  const splittedLines = configContent.split("\n");
  const arr = [];
  let currentObject = {};
  let jsonContent = currentObject;

  splittedLines.forEach((line) => {
    const trimmedLine = line.trim();

    if (trimmedLine.endsWith("{")) {
      const newObject = {};
      const key = trimmedLine.slice(0, -1).trim();
      currentObject[key] = newObject;
      arr.push(currentObject);
      currentObject = newObject;
    } else if (trimmedLine === "}") {
      currentObject = arr.pop();
    } else {
      const [key, value] = trimmedLine.split(" ");

      if (key && value) {
        currentObject[key] = value;
      }
    }
  });

  return JSON.stringify(jsonContent, null, 2);
}

function processConfigFile(directory, filename) {
  const configFilePath = path.join(directory, filename);

  if (path.extname(configFilePath) === ".conf") {
    const configContent = fs.readFileSync(configFilePath, "utf-8");

    const jsonContent = convertConfigToJson(configContent);

    if (jsonContent !== null) {
      const jsonFilename = `${path.basename(filename, ".conf")}.json`;
      const jsonFilePath = path.join(directory, jsonFilename);
      fs.writeFileSync(jsonFilePath, jsonContent, "utf-8");

      console.log(`Created ${jsonFilename}`);
    }
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  files.forEach((filename) => {
    processConfigFile(directory, filename);
  });
}

function processDirectories(directories) {
  directories.forEach((directory) => {
    processDirectory(directory);
  });
}

const myDir = [
  "./Categories",
  "./Categories/Editor",
  "./Categories/Equipment",
  "./Categories/Gameplay",
  "./Categories/Introduction",
  "./Categories/MpModes",
];

processDirectories(myDir);
