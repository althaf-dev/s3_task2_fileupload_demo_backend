const AWS = require('aws-sdk');
require('dotenv').config();
const { v4: uuid } = require('uuid');
const { addImage } = require('../model/model');

function getPresigneds3url(fileName, filetype) {
  const s3 = new AWS.S3({
    region: 'ap-south-1',
  });

  const BUCKET = process.env.bucket;

  const objectKey = `private/users/${uuid()}/${fileName}`;
  console.log('bucket:::::::', BUCKET, filetype, objectKey);
  const url = s3.getSignedUrl('putObject', {
    Bucket: BUCKET,
    Key: objectKey,
    ContentType: filetype,
    Expires: 60,
  });

  return { url, objectKey };
}

async function storeKeysInDb(objectKey, fileName) {
  
  if(!objectKey || !fileName){
    console.log("error")
     const err = new Error("require params missing");
     err.status = 400;
     throw err;
  }
  const response = await addImage(objectKey, fileName);
  return response;
}

module.exports = {
  getPresigneds3url,
  storeKeysInDb,
};
