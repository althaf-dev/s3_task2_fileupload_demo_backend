const express = require('express');
const {
  getPresigneds3url,
  storeKeysInDb,
  getSignedCookiesFromCloudFront,
  getSignedurlForImages,
} = require('../service/service');
const { asyncHandler } = require('../middlware/errorHandler');

const router = express();

router.post(
  '/url',
  asyncHandler((req, res) => {
    const { fileName, fileType } = req.body ?? {};
    const { url, objectKey } = getPresigneds3url(fileName, fileType);
    res.status(200).json({
      url: url,
      key: objectKey,
    });
  })
);

router.post(
  '/success',
  asyncHandler(async (req, res) => {
    const { objectKey, fileName } = req.body;
    const result = await storeKeysInDb(objectKey, fileName);
    if (result)
      res.status(201).json({
        message: 'Database updated succesfully',
      });
    else
      res.status(201).json({
        message: 'Database not updated',
      });
  })
);

router.get(
  '/view',
  asyncHandler(async (req, res, next) => {
    const images = await getSignedurlForImages()

    res.status(200).json({
      message: 'created signed cookies',
      images
    });
  })
);
module.exports = router;
