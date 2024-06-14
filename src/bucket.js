const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');
const stream = require('stream');

// GOOGLE BUCKET
const storage = new Storage({ projectId: "pdinsight" });
const bucketName = 'files-bucket-24pdinsight'
const bucket = storage.bucket(bucketName);
const upload = multer({
    storage: multer.memoryStorage()
});

const uploadToBucket = async(res, file) => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const fileExtension = path.extname(file.originalname);
    const newFileName = `audio-${timestamp}-${randomNum}${fileExtension}`;

    console.log("File Uploaded: ", file);

    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const fileURL = `https://storage.googleapis.com/${bucketName}/${newFileName}`;

    try {
        const gcsFile = bucket.file(newFileName);
        const streamPromise = new Promise((resolve, reject) => {
            bufferStream.pipe(gcsFile.createWriteStream({
                resumable: false,
                metadata: {
                    contentType: file.mimetype,
                },
            }))
                .on('finish', resolve)
                .on('error', reject);
        });

        await streamPromise;
        console.log(`File uploaded to ${fileURL}`);
        const newFile = {
            fileURL : fileURL,
            newFileName : newFileName
        }
        console.log(newFile);
        return newFile;
    } catch (uploadError) {
        console.error('Error uploading file to Google Cloud Storage:', uploadError);
        return res.status(500).send('Error uploading file.');
    }
}

const deleteTempFile = async (res, newFileName) => {
    try {
        await bucket.file(newFileName).delete();
        console.log(`File with name ${newFileName} is deleted.`);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occurred", error: error.message });
    }
}


module.exports = {
    storage,
    bucketName,
    bucket,
    upload,
    uploadToBucket,
    deleteTempFile
}
