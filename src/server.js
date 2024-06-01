const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser")
const axios = require('axios');

const { bucketName, bucket, upload } = require('./bucket');
const { uploadHandler } = require('./handler');
const { addUserHandler, addDataToFirestore } = require('./firestore');

const app = express();

const port = 3001;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.post('/api/adduser', (req, res) => {
    addUserHandler(req, res)
})

app.post('/api/upload', upload.single('file'), async (req, res) => {
    uploadHandler(req, res, bucket, bucketName)
});

app.listen(port, () => {
    console.log("Server started on http://localhost:" + port);
})