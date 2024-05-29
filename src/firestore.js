const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

const credentials = path.join("./bucket.json") 
const firestore = new Firestore({keyFilename: credentials});

const addUserHandler = async (req,res) => {
    const { uid } = req.body;
    try {
        const response = await firestore.collection('users').doc(uid).set({});
      
        if (!response) {
          console.log("Error");
          return res.status(400).json({
            message: "Failed to add User"
          });
        }
        console.log("Success add user with uid:", uid);
        res.status(200).json({
          message: "Success to add User"
        });
      } catch (error) {
        console.error("Error adding user:", error);
        return res.status(500).json({
          message: "Internal Server Error"
        });
      }
}


        // Cek apakah dokumen pengguna sudah ada di Firestore
        // const userDoc = await firebase.firestore().collection('users').doc(uid).get();
        // if (!userDoc.exists) {
        //     // Jika dokumen tidak ada, simpan informasi pengguna ke Firestore
        //     await firebase.firestore().collection('users').doc(uid).set({
        //         // Sesuaikan dengan data pengguna yang ingin Anda simpan
        //         displayName: user.displayName,
        //         email: user.email,
        //         photoURL: user.photoURL,
        //         // dll.
        //     });
        // }


module.exports = {
    addUserHandler,
}