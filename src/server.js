const express = require('express');
const cors = require('cors');

const { upload } = require('./bucket');
const { uploadHandler } = require('./handler');
const { addUserHandler, firestore, getReadableTimestamp } = require('./firestore');

const app = express();

const port = 8080;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.post('/api/adduser', (req, res) => {
    addUserHandler(req, res)
})

app.post('/api/upload', upload.single('file'), async (req, res) => {
    uploadHandler(req, res)
});

app.get('/api/getdata', async (req, res) => {
    const userID = req.query.uid;
    const docID = req.query.transcribeid;

    if (!userID || !docID) {
        return res.status(400).send('Missing userID or docID parameter');
    }

    try {
        const userDocRef = firestore.collection('users').doc(userID).collection('transcribe').doc(docID);
        const doc = await userDocRef.get();

        if (!doc.exists) {
            return res.status(404).send('Document not found');
        }
        
        const now = getReadableTimestamp()
        console.log("Hit on", now);

        return res.status(200).json({
            message: "Success",
            data: doc.data()
        });
    } catch (error) {
        console.error('Error getting document:', error);
        return res.status(500).send('Error getting document');
    }
})

app.get('/api/gethistory', async (req, res) => {
    const userID = req.query.uid;

    if (!userID) {
        return res.status(400).send('Missing userID parameter');
    }

    try {
        const transcribeCollectionRef = firestore.collection('users').doc(userID).collection('transcribe');
        const snapshot = await transcribeCollectionRef.get();

        if (snapshot.empty) {
            return res.status(404).send('No documents found in transcribe collection');
        }

        const data = [];
        snapshot.forEach(doc => {
            const docData = doc.data();
            data.push({
                Date: docData.createdAt,
                Source: doc.id,
                link: docData.filename
            });
        });

        const now = getReadableTimestamp();
        console.log("Hit on", now);

        return res.status(200).json({
            message: "Success",
            data: data
        });
    } catch (error) {
        console.error('Error getting documents:', error);
        return res.status(500).send('Error getting documents');
    }
});

app.listen(port, () => {
    console.log("Server started on http://localhost:" + port);
})