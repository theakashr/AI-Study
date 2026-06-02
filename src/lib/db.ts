import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function saveAgentData(collectionName: string, userId: string, data: any) {
  if (!userId) throw new Error("User must be logged in to save data.");
  
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      userId,
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error saving to ${collectionName}:`, error);
    throw error;
  }
}

import { doc, setDoc } from "firebase/firestore";

export async function updateAgentData(collectionName: string, docId: string, data: any) {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error(`Error updating ${collectionName}:`, error);
    throw error;
  }
}
