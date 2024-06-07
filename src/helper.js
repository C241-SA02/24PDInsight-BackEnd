const axios = require('axios');
const { updateDataToFirestore } = require('./firestore');

const hitSentiment = async (transcribeResult, uid, docID) => {
    try {
        // const [sentimentAnalysis, wordcloud, summarize, entity, topicModel] = await Promise.all([
        //     axios.post('/sentiment', { transcription: result }),
        //     axios.post('/wordcloud', { transcription: result }),
        //     axios.post('/summarize', { transcription: result }),
        //     axios.post('/entity', { transcription: result }),
        //     axios.post('/topic_model', { transcription: result })
        // ]);

        const response = await axios.post('/sentiment', {
            transcription: transcribeResult
        })

        // const data = {
        //     transcribe: result,
        //     sentiment: sentimentAnalysis.data.sentiment_analysis,
        //     wordcloud: wordcloud.data.wordcloud,
        //     summarize: summarize.data.summary,
        //     entity: entity.data.ner_analysis,
        //     topicModel: topicModel.data.topics
        // };

        const data = {
            sentiment: response.data.sentiment_analysis,
        };

        const ipnutTitle = "sentiment"
        updateDataToFirestore(data, uid, docID, ipnutTitle);

        console.log("Data result : ", data, "\n");

        return data;
    } catch (error) {
        console.error("An error occurred while processing the transcription: ", error);
        throw error;
    }
}

const hitWordcloud = async (transcribeResult, uid, docID) => {
    try {
        const response = await axios.post('/wordcloud', {
            transcription: transcribeResult
        })

        const data = {
            wordcloud: response.data.wordcloud,
        };

        const ipnutTitle = "wordcloud"
        updateDataToFirestore(data, uid, docID, ipnutTitle);

        console.log("Data result : ", data, "\n");

        return data;
    } catch (error) {
        console.error("An error occurred while processing the transcription: ", error);
        throw error;
    }
}

const hitSummarize = async (transcribeResult, uid, docID) => {
    try {
        const response = await axios.post('/summarize', {
            transcription: transcribeResult
        })

        const data = {
            summarize: response.data.summary,
        };

        const ipnutTitle = "summarize"
        updateDataToFirestore(data, uid, docID, ipnutTitle);

        console.log("Data result : ", data, "\n");

        return data;
    } catch (error) {
        console.error("An error occurred while processing the transcription: ", error);
        throw error;
    }
}

const hitEntity = async (transcribeResult, uid, docID) => {
    try {
        const response = await axios.post('/entity', {
            transcription: transcribeResult
        })

        const data = {
            entity: response.data.ner_analysis,
        };

        const ipnutTitle = "entity"
        updateDataToFirestore(data, uid, docID, ipnutTitle);

        console.log("Data result : ", data, "\n");

        return data;
    } catch (error) {
        console.error("An error occurred while processing the transcription: ", error);
        throw error;
    }
}

const hitTopics = async (transcribeResult, uid, docID) => {
    try {
        const response = await axios.post('/topic_model', {
            transcription: transcribeResult
        })

        const data = {
            topicModel: response.data.topics,
        };

        const ipnutTitle = "topicModel"
        updateDataToFirestore(data, uid, docID, ipnutTitle);

        console.log("Data result : ", data, "\n");

        return data;
    } catch (error) {
        console.error("An error occurred while processing the transcription: ", error);
        throw error;
    }
}

module.exports = {
    hitSentiment,
    hitWordcloud,
    hitSummarize,
    hitEntity,
    hitTopics
}