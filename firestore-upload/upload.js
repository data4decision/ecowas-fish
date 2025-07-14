const admin = require("firebase-admin");
const fs = require("fs");

// 🔑 Path to your service account key
const serviceAccount = require("./serviceAccountKey.json");

// 🔥 Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// 📁 Load your JSON file
const rawData = fs.readFileSync("ecowas_fisheries_complete_dataset_2024.json");
const fisheriesData = JSON.parse(rawData);

// 📤 Upload each item to a collection
async function uploadData() {
  const batch = db.batch();
  const collectionRef = db.collection("dashboardData");

  const docRef = collectionRef.doc("ng-dashboard");
batch.set(docRef, { fisheriesData }); // wraps array in one document


  try {
    await batch.commit();
    console.log("✅ Upload complete!");
  } catch (err) {
    console.error("❌ Error uploading data:", err);
  }
}

uploadData();
