const { Image } = require('../config/db');

async function addImage(objectKey, fileName) {
  const response = await Image.insertOne({
    objectKey,
    fileName,
  });
  return response;
}

module.exports = {
  addImage,
};
