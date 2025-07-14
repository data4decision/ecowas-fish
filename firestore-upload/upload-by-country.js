const admin = require("firebase-admin");
const fs = require("fs");

// 🔑 Load Firebase service key
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// 📁 Load full dataset
const rawData = fs.readFileSync("ecowas_fisheries_complete_dataset_2024.json");
const allData = JSON.parse(rawData);

// 🔃 Group data by country code
const groupedByCountry = {};
allData.forEach(item => {
  const country = item.country?.toLowerCase();
  if (!country) return;

  if (!groupedByCountry[country]) {
    groupedByCountry[country] = [];
  }
  groupedByCountry[country].push(item);
});

// 📤 Upload each group to Firestore
async function uploadGroupedData() {
  for (const [countryCode, records] of Object.entries(groupedByCountry)) {
    const dashboardRef = db.collection("dashboardData").doc(`${countryCode}-dashboard`);
    const recordsRef = dashboardRef.collection("records");

    const batch = db.batch();
    records.forEach((record, index) => {
      const docRef = recordsRef.doc(`record_${index + 1}`);
      batch.set(docRef, record);
    });

    try {
      await batch.commit();
      console.log(`✅ Uploaded ${records.length} records for ${countryCode.toUpperCase()}`);
    } catch (err) {
      console.error(`❌ Failed for ${countryCode.toUpperCase()}:`, err.message);
    }
  }
}

uploadGroupedData();
