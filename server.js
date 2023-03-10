// server.js
const aws = require('aws-sdk');
const express = require("express");
const multer = require("multer");
const multerS3 = require('multer-s3');
const uuid = require('uuid').v4;
const path = require('path');

const port = process.env.PORT || 3000;
// const port = 5001;

const app = express();
const s3 = new aws.S3({
    apiVersion: '2006-03-01',
    signatureVersion: 'v4'
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: 's3-sky-group-design-images',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuid()}${ext}`);
        }
    })
});

app.listen(port, function (err) {
    if (err) {
        console.log("ERROR", err);
    } else {
        //console.log('Server started at port ' + (process.env.PORT || 3000));
        console.log('Server started at port ' + (port));
    }
});

app.post("/upload_files", upload.array("files"), uploadFiles);

function uploadFiles(req, res, err) {
    console.log(err);

    res.setHeader('Content-Type', 'application/json');
    return res.json({ newImageName: req.files[0].key, imageLocation: req.files[0].location })
}
