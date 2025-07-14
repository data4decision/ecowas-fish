import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase/firebase";

export async function uploadCountryExcel(file, currentUser, countryCode, dataType) {
  try {
    const fileRef = ref(storage, `uploads/${countryCode}/${currentUser.uid}/${file.name}`);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);

    await addDoc(collection(db, "uploads"), {
      uid: currentUser.uid,
      countryCode,
      fileUrl,
      dataType,
      uploadedAt: serverTimestamp(),
    });

    return { success: true, message: "Upload successful!" };
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false, message: error.message };
  }
}
