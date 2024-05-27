const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');

const credentials = path.join("./bucket.json") 

// GOOGLE BUCKET
const storage = new Storage({ keyFilename: credentials });
const bucketName = 'files-bucket-24pdinsight'
const bucket = storage.bucket(bucketName);
const upload = multer({
    storage: multer.memoryStorage()
});

module.exports = {
    storage,
    bucketName,
    bucket,
    upload
}
