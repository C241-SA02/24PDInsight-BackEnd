const express = require('express');
const cors = require('cors');

const { upload } = require('./bucket');
const { uploadHandler } = require('./handler');
const { addUserHandler, firestore, getReadableTimestamp } = require('./firestore');

const app = express();

const port = 3001;

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

app.listen(port, () => {
    console.log("Server started on http://localhost:" + port);
})