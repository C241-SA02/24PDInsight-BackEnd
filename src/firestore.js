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
  res
) => {
  const uid = crypto.randomUUID();
  try {
    // Membuat referensi ke koleksi dengan ID acak (uid)
    const userCollectionRef = firestore.collection("users").doc(userID).collection("transcribe");

    // Mendapatkan dokumen dari koleksi
    const userDocRef = userCollectionRef.doc(uid);

    // Menambahkan data ke dalam dokumen
    await userDocRef.set({
      transcribe: data.transcribe,
      sentiment_analysis: data.sentiment_analysis,
      ner: data.ner,
      wordcloud: data.wordcloud
    });

    console.log("Succeed with data: ", data);
    return res.status(200).json({
      message: "Success to add data on Firestore",
      data: data
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Failed to add data on Firestore",
      error: error.message
    });
  }


  // console.log("Couldn't Find The Data Reference");
  // return res.status(400).json({
  //   message: "Couldn't Find The Data Reference"
  // })
}

module.exports = {
  addUserHandler,
  addDataToFirestore,
}