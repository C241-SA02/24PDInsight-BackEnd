const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser")
const axios = require('axios');

const { bucketName, bucket, upload } = require('./bucket');
const { uploadFileHandler, sentimentAnalysisHandler, uploadLinkHandler } = require('./handler');

const app = express();

const port = 3001;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.post('/api/uploadfile', upload.single('file'), async (req, res) => {
    uploadFileHandler(req, res, bucket, bucketName)
});

app.post('/api/uploadlink', (req, res) => {
    uploadLinkHandler(req, res)
});

app.post('/api/sentimentanalysis', async (req, res) => {
    sentimentAnalysisHandler(req,res)
})

app.listen(port, () => {
    console.log("Server started on http://localhost:" + port);
})