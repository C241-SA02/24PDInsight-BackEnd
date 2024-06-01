const path = require('path');
const stream = require('stream');
const axios = require('axios');

axios.defaults.baseURL = 'https://m0t98818-5000.asse.devtunnels.ms/';
axios.defaults.headers.post["Content-Type"] = "application/json";

const uploadHandler = async (req, res, bucket, bucketName) => {
    if (!req.file && !req.body.link) {
        console.log("No file or link attached");
        return res.status(400).json({
            message: "No file or link attached. Please Attach File"
        })
    }

    console.log(req.file);
    console.log(req.body.link);

    // If a link is provided, handle it
    if (req.body.link) {
        console.log("ke link ", req.body.link);
        return linkHandler(res, req.body.link);
    }

    // If a file is provided, handle it
    if (req.file) {
        console.log("ke file");
        return file(req, res, bucketName, bucket);
    }
};

const linkHandler = async (res, link) => {
    if (!link) {
        console.log("Body empty");
        return res.status(400).json({ message: "Failed" });
    }

    try {
        const transcribeResult = await axios.post('/transcribe', { url: link });
        const transcription = transcribeResult.data.transcription;
        // console.log('Transcription response: ', transcription);
        
        const sentimentAnalysis = await axios.post('/sentiment', { transcription: transcription });
        const wordcloud = await axios.post('/wordcloud', { transcription:transcription });

        const data = {
            transcribe: transcription,
            sentiment: sentimentAnalysis.data.sentiment_analysis,
            wordcloud: wordcloud.data.wordcloud
        };

        return res.status(200).json({
            message: "Succeed",
            data: data
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).json({ message: "Error occurred", error: error.message });
    }
};

const deleteTempFile = async (bucket, newFileName, res) => {
    try {
        await bucket.file(newFileName).delete();
        console.log(`File with name ${newFileName} is deleted.`);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occurred", error: error.message });
    }
}

const process = async (transcribeResult) => {
    const result = transcribeResult.data.transcription

    console.log('Transcription response: ', result);

    const sentimentAnalysis = await axios.post('/sentiment', {
        transcription: result
    })

    const wordcloud = await axios.post('/wordcloud', {
        transcription: result
    })

    const data = {
        transcribe: transcribeResult.data.transcription,
        sentiment: sentimentAnalysis.data.sentiment_analysis,
        wordcloud: wordcloud.data.wordcloud
    }

    return data
}

const file = async(req, res, bucketName, bucket) => {
    const file = req.file

    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const fileExtension = path.extname(req.file.originalname);
    const newFileName = `audio-${timestamp}-${randomNum}${fileExtension}`;

    console.log("File Uploaded: ", file);

    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const fileURL = `https://storage.googleapis.com/${bucketName}/${newFileName}`;

    try {
        const file = bucket.file(newFileName);
        const streamPromise = new Promise((resolve, reject) => {
            bufferStream.pipe(file.createWriteStream({
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

        try {
            const transcribeResult = await axios.post('/transcribe', {
                url: fileURL,
            });

            deleteTempFile(bucket, newFileName, res);
            const data = await process(transcribeResult);

            return res.status(200).json({
                message: 'File and form data uploaded and processed.',
                data: data
            }
            );
        } catch (transcriptionError) {
            console.error('Error in transcription request:', transcriptionError);
            return res.status(500).send('Error processing transcription.');
        }
    } catch (uploadError) {
        console.error('Error uploading file to Google Cloud Storage:', uploadError);
        return res.status(500).send('Error uploading file.');
    }
}

module.exports = {
    uploadHandler,
}