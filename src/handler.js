const path = require('path');
const stream = require('stream');

const uploadFileHandler = async(req, res, bucket, bucketName) => {
    if (!req.file) {
        console.log("No file uploaded");
        return res.status(400).json('No file uploaded.');
    }

    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const fileExtension = path.extname(req.file.originalname);
    const newFileName = `audio-${timestamp}-${randomNum}${fileExtension}`;

    console.log("File Uploaded: ", req.file);

    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    try {
        const file = bucket.file(newFileName)
        bufferStream.pipe(file.createWriteStream({
            resumable: false,
            metadata: {
                contentType: req.file.mimetype
            }
        }))
        .on('finish', () => {
            console.log(`File uploaded to https://storage.googleapis.com/${bucketName}/${newFileName}`);
            return res.status(200).json('File and form data uploaded and processed.');
        })
        .on('error', (err) => {
            console.error('Error uploading file to Google Cloud Storage:', err);
            return res.status(500).send('Error uploading file.');
        });

    } catch (error) {
        console.error('Error during file upload process:', error);
        return res.status(500).send('Error uploading file.');
    }
}

module.exports = {
    uploadFileHandler
}