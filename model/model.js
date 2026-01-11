const { Image } = require('../config/db');

async function addImage(objectKey, fileName) {
  const response = await Image.insertOne({
    objectKey,
    fileName,
  });
  return response;
}


async function getImages(){
  const res = await Image.find({});
  console.log("images:::::::::",res);
  return [...res];
}

module.exports = {
  addImage,
  getImages
};
