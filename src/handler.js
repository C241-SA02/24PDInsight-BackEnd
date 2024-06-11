const path = require('path');

const axios = require('axios');
const { uploadToBucket, deleteTempFile } = require('./bucket');
const { addDataToFirestore } = require('./firestore');
const { hitEntity, hitSentiment, hitSummarize, hitTopics, hitWordcloud } = require('./helper');

axios.defaults.baseURL = 'https://m0t98818-5000.asse.devtunnels.ms/';
axios.defaults.headers.post["Content-Type"] = "application/json";

const uploadHandler = async (req, res) => {
    if (!req.body.uid) {
        console.log("User not authenticated");
        return res.status(400).json({
            message: "User is not authenticated"
        })
    }

    const uid = req.body.uid

    if (!req.file && !req.body.link) {
        console.log("No file or link attached");
        return res.status(400).json({
            message: "No file or link attached. Please Attach File"
        })
    }

    

    if (req.body.link) {
        console.log("Processing link: ", req.body.link);
        return linkHandler(res, req.body.link, uid);
    }

    if (req.file) {
        console.log("Processing file upload");
        return file(res, req.file, uid);
    }
};

const linkHandler = async (res, link, uid) => {
    if (!link) {
        console.log("Body empty");
        return res.status(400).json({ message: "Failed" });
    }

    try {
        const transcribeResult = await axios.post('/transcribe', { url: link });

        const data = await process(transcribeResult, uid)

        return res.status(200).json({
            message: `Success to add transcribe with document id ${data.docid}`,
            data: data.transcribe
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).json({ message: "Error occurred", error: error.message });
    }
};

const file = async (res, file , uid) => {
    const uploadFile = await uploadToBucket(res, file)

    try {
        const transcribeResult = await axios.post('/transcribe', { url: uploadFile.fileURL });
        deleteTempFile(res, uploadFile.newFileName);
        const data = await process(transcribeResult, uid);

        return res.status(200).json({
            message: 'File and form data uploaded and processed.',
            data: data
        });
    } catch (transcriptionError) {
        console.error('Error in transcription request:', transcriptionError);
        return res.status(500).send('Error processing transcription.');
    }

};

const process = async (transcribeResult, uid) => {
    const result = transcribeResult.data.transcription;
    const docID = crypto.randomUUID()
    addDataToFirestore(result, uid, docID)
    hitOther(result, uid, docID)

    console.log(`Added to firestore with Document ID : ${docID} and User ID : ${uid}`);

    const data = {
        docid: docID,
        transcribe: result
    }

    return data
}

const hitOther = (transcribeResult, uid, docID) => {
    hitSentiment(transcribeResult, uid, docID)
    hitEntity(transcribeResult, uid, docID)
    hitSummarize(transcribeResult, uid, docID)
    hitTopics(transcribeResult, uid, docID)
    hitWordcloud(transcribeResult, uid, docID)
}

module.exports = {
    uploadHandler,
}