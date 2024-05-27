const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const stream = require('stream');

const { bucketName, bucket, upload } = require('./bucket');
const { uploadFileHandler } = require('./handler');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json())


app.post('/api/uploadfile', upload.single('file'), async (req, res) => {
    uploadFileHandler(req, res, bucket, bucketName)
});

app.post('/api/uploadlink', (req, res) => {
    const { link } = req.body;
    if (!link) {
        console.log("it goes right here ", link);
        return res.status(400).json({ error: 'Link is required' });
    }

    console.log('Received link:', link);
    res.status(200).json({ message: 'Link uploaded successfully', link });
});




app.listen(port, () => {
    console.log("Server started on http://localhost:" + port);
})