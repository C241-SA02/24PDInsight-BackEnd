const { Firestore } = require('@google-cloud/firestore');
const path = require('path');
const crypto = require('crypto');

const credentials = path.join("./bucket.json")
const firestore = new Firestore({ keyFilename: credentials });

const addUserHandler = async (req, res) => {
  const { uid } = req.body;
  try {
    const userDoc = await firestore.collection('users').doc(uid).get();
    const response = await userDoc.ref.set({});
    if (response) {
      console.log("Success add user with uid:", uid);
      return res.status(200).json({
        message: "Success to add User"
      });
    } else {
      console.log("Error");
      return res.status(400).json({
        message: "Failed to add User"
      });
    }
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

const addDataToFirestore = async (
  data,
  userID,
  // res
) => {
  const uid = crypto.randomUUID();
  try {
    // Membuat referensi ke koleksi dengan ID acak (uid)
    const userCollectionRef = firestore.collection("users").doc(userID).collection("transcribe");

    const now = getReadableTimestamp()

    // Mendapatkan dokumen dari koleksi
    const userDocRef = userCollectionRef.doc(uid);
    const retreivedData = {
      transcribe: data.transcribe,
      sentiment: data.sentiment,
      wordcloud: data.wordcloud,
      summarize: data.summarize,
      entity: data.entity,
      topicModel: data.topicModel,
      createdAt: now
  };

    await userDocRef.set(retreivedData);

    console.log("Succeed with data: ", retreivedData);
    // return res.status(200).json({
    //   message: "Success to add data on Firestore",
    //   data: retreivedData
    // });
  } catch (error) {
    // console.log(error);
    // return res.status(400).json({
    //   message: "Failed to add data on Firestore",
    //   error: error.message
    // });
  }
}

function getReadableTimestamp() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return timestamp;
}

module.exports = {
  addUserHandler,
  addDataToFirestore,
}