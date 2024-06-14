const { Firestore } = require('@google-cloud/firestore');
const path = require('path');
const crypto = require('crypto');
const moment = require('moment-timezon');

const firestore = new Firestore({ databaseId: 'firestore24pdinsight' });

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
  docID,
  filename
) => {
  try {
    // Membuat referensi ke koleksi dengan ID acak (uid)
    const userCollectionRef = firestore.collection("users").doc(userID).collection("transcribe");

    const now = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

    // Mendapatkan dokumen dari koleksi
    const userDocRef = userCollectionRef.doc(docID);
    const retreivedData = {
      transcribe: data,
      createdAt: now,
      filename: filename
    };

    await userDocRef.set(retreivedData);

    console.log("Succeed with data: ", retreivedData);
  } catch (error) {
    console.log(error);
  }
}

const updateDataToFirestore = async (
  data,
  userID,
  docID,
  inputDataTitle
) => {
  const userCollectionRef = firestore.collection("users").doc(userID).collection("transcribe");
  const now = getReadableTimestamp()
  const userDocRef = userCollectionRef.doc(docID);
  const retreivedData = {
    [inputDataTitle]: data[inputDataTitle],
    updatedAt: now
  };
  await userDocRef.update(retreivedData);
}

module.exports = {
  addUserHandler,
  addDataToFirestore,
  updateDataToFirestore,
  firestore,
}