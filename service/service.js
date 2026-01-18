const AWS = require('aws-sdk');
const fs = require('fs/promises');
const { getSignedCookies } = require('@aws-sdk/cloudfront-signer');
require('dotenv').config();
const { v4: uuid } = require('uuid');
const { addImage, getImages } = require('../model/model');

function getPresigneds3url(fileName, filetype) {
  const s3 = new AWS.S3({
    region: 'ap-south-1',
  });

  const BUCKET = process.env.bucket;

  if (!fileName || !filetype) {
    const err = new Error('required parmas missing');
    err.status = 400;
    throw err;
  }

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
  if (!objectKey || !fileName) {
    console.log('error');
    const err = new Error('require params missing');
    err.status = 400;
    throw err;
  }
  const response = await addImage(objectKey, fileName);
  return response;
}

async function getSignedCookiesFromCloudFront() {
  const privateKey = await fs.readFile(
    'secrets/cloudfront-private-key.pem',
    'utf-8'
  );
  const keyPairId = process.env.cloudFrontKey || '';
  const resource = process.env.cloudFrontUrl;
  const policy = {
    Statement: [
      {
        Resource: `${resource}/private/*`,
        Condition: {
          DateLessThan: {
            'AWS:EpochTime': Math.floor(Date.now() / 1000) + 3600,
          },
        },
      },
    ],
  };
  const cookies = getSignedCookies({
    keyPairId,
    privateKey,
    policy: JSON.stringify(policy),
  });

  const ImagesFromDb = await getImages();
  const images = ImagesFromDb?.map(img=>({
    fileName:img.fileName,
    objectKey:`${resource}${img.objectKey}`
  }))
  
  return {cookies,images}
}

async function getSignedurlForImages(){
  const ImagesFromDb = await getImages();

    const s3 = new AWS.S3({
    region: 'ap-south-1',
  });
console.log("images from db::;",ImagesFromDb)
  const BUCKET = process.env.bucket;

  const images = ImagesFromDb?.filter(img=>img.fileName.includes('.jpg'))?.map(img=>({
    url: s3.getSignedUrl('getObject',{
      Bucket:BUCKET,
      Key:img.objectKey,
      Expires:120
    })
  }));
  console.log("images::;",images)
  return images;
}

module.exports = {
  getPresigneds3url,
  storeKeysInDb,
  getSignedCookiesFromCloudFront,
  getSignedurlForImages
};
