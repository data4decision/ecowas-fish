const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function testConnection() {
  try {
    await db.collection("testCollection").doc("testDoc").set({ test: "Hello Firestore!" });
    console.log("✅ Successfully connected and wrote test document!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testConnection();
