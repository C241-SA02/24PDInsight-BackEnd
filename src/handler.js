const path = require('path');

const axios = require('axios');
const { uploadToBucket, deleteTempFile } = require('./bucket');
const {addDataToFirestore} = require('./firestore');

axios.defaults.baseURL = 'https://m0t98818-5000.asse.devtunnels.ms/';
axios.defaults.headers.post["Content-Type"] = "application/json";

const uploadHandler = async (req, res, bucket, bucketName) => {
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
            message: "Succeed",
            data: data
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

    console.log('Transcription response: ', result, "\n");

    try {
        const [sentimentAnalysis, wordcloud, summarize, entity, topicModel] = await Promise.all([
            axios.post('/sentiment', { transcription: result }),
            axios.post('/wordcloud', { transcription: result }),
            axios.post('/summarize', { transcription: result }),
            axios.post('/entity', { transcription: result }),
            axios.post('/topic_model', { transcription: result })
        ]);

        const data = {
            transcribe: result,
            sentiment: sentimentAnalysis.data.sentiment_analysis,
            wordcloud: wordcloud.data.wordcloud,
            summarize: summarize.data.summary,
            entity: entity.data.ner_analysis,
            topicModel: topicModel.data.topics
        };

        // axios.post('http://localhost:3001/addData', data)
        // const dummyID = "DummyID"
        addDataToFirestore(data, uid)

        console.log("Data result : ", data, "\n");

        return data;
    } catch (error) {
        console.error("An error occurred while processing the transcription: ", error);
        throw error;  // Rethrow the error if you want it to be handled by the caller
    }
}

// const deleteTempFile = async (bucket, newFileName, res) => {
//     try {
//         await bucket.file(newFileName).delete();
//         console.log(`File with name ${newFileName} is deleted.`);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "Error occurred", error: error.message });
//     }
// }

module.exports = {
    uploadHandler,
}