// ionParser.js
const ion = require("ion-js");

function parseIonFile(filePath) {
  const fs = require("fs");
  const ionData = fs.readFileSync(filePath);
  const reader = ion.makeReader(ionData);
  const result = {};

  // Ensure the root is a struct
  if (reader.next() && reader.type() === ion.IonTypes.STRUCT) {
    console.log("Parsing...");

    reader.stepIn(); // Step into the struct

    while (reader.next()) {
      const fieldName = reader.fieldName();
      const value = parseValue(reader);
      result[fieldName] = value;
    }

    reader.stepOut(); // Step out of the struct

    // Print the struct
    console.log("Parsed Success");
  } else {
    console.error("Could not parse file.");
  }

  return result;
}

function parseValue(reader) {
  const type = reader.type();

  switch (type) {
    case ion.IonTypes.INT:
      return reader.numberValue();
    case ion.IonTypes.STRING:
      return reader.stringValue();
    case ion.IonTypes.BOOL:
      return reader.booleanValue();
    case ion.IonTypes.LIST:
      return parseList(reader);
    case ion.IonTypes.STRUCT:
      return parseStruct(reader);
    case ion.IonTypes.BLOB:
      const blob = reader.value(); // Get the byte array
      return Buffer.from(blob).toString("base64"); // Convert to base64 string

      return blob;
      // case ion.IonTypes.CLOB:
      //   return reader.stringValue(); // Handle CLOB as string
      return "";
    default:
      return reader.value();
  }
}

function parseList(reader) {
  const list = [];
  reader.stepIn(); // Step into the list

  while (reader.next()) {
    list.push(parseValue(reader));
  }

  reader.stepOut(); // Step out of the list
  return list;
}

function parseStruct(reader) {
  const struct = {};
  reader.stepIn(); // Step into the struct

  while (reader.next()) {
    const fieldName = reader.fieldName();
    struct[fieldName] = parseValue(reader);
  }

  reader.stepOut(); // Step out of the struct
  return struct;
}

// Function to retrieve botInfo from metadata
function getBotInfo(parsedData) {
  return parsedData.metadata?.botInfo || null;
}

// Function to retrieve sessionInfo from metadata
function getSessionInfo(parsedData) {
  return parsedData.metadata?.sessionInfo || null;
}

// Function to retrieve botModel from metadata
function getBotModel(parsedData) {
  return parsedData.metadata?.botModel || null;
}

// Function to retrieve all topics
function getAllTopics(parsedData) {
  return parsedData.topics || [];
}

// Function to retrieve a specific topic by topicName
function getTopicByName(parsedData, topicName) {
  const topic =
    parsedData.topics?.find((topic) => topic.topicName === topicName) || null;
  console.log("topic", topic);
  return topic;
}

// Function to retrieve a specific topic with a topicType "sensor_msgs/CompressedImage"
function getTopicByType(parsedData, topicType = "sensor_msgs/CompressedImage") {
  return (
    parsedData.topics?.find((topic) => topic.topicType === topicType) || null
  );
}

module.exports = {
  parseIonFile,
  getBotInfo,
  getSessionInfo,
  getBotModel,
  getAllTopics,
  getTopicByName,
  getTopicByType,
};
