// src/utils/handleUpload.js
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebase';

export async function handleUpload(file, currentUser, countryCode, dataType = "report") {
  if (!file || !currentUser || !countryCode) {
    throw new Error("Missing file, user, or country code.");
  }

  try {
    // 1. Upload to Firebase Storage
    const filePath = `uploads/${countryCode}/${currentUser.uid}/${file.name}`;
    const fileRef = ref(storage, filePath);
    await uploadBytes(fileRef, file);

    const fileUrl = await getDownloadURL(fileRef);

    // 2. Save metadata in Firestore
    const docRef = await addDoc(collection(db, "uploads"), {
      uid: currentUser.uid,
      countryCode,
      fileUrl,
      fileName: file.name,
      dataType,
      uploadedAt: serverTimestamp(),
    });

    return { success: true, docId: docRef.id, fileUrl };
  } catch (err) {
    console.error("Upload failed:", err);
    return { success: false, error: err.message };
  }
}
