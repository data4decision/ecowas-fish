const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.assignUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth?.token?.isAdmin) {
    throw new functions.https.HttpsError("permission-denied", "Only admins can assign roles");
  }

  const { uid, countryCode, isAdmin } = data;

  try {
    await admin.auth().setCustomUserClaims(uid, {
      isAdmin: !!isAdmin,
      country: countryCode,
    });

    return { success: true, message: `Role assigned to user ${uid}` };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});
