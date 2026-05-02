import { db } from './firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';

export const saveApplication = async (userId: string, applicationData: any) => {
  try {
    const appRef = doc(collection(db, 'applications'));
    await setDoc(appRef, {
      ...applicationData,
      userId,
      status: 'Under Review',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return appRef.id;
  } catch (error) {
    console.error("Error saving application:", error);
    throw error;
  }
};

export const saveDocument = async (userId: string, fileData: any) => {
  try {
    const docRef = doc(collection(db, 'documents'));
    await setDoc(docRef, {
      ...fileData,
      userId,
      uploadedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving document:", error);
    throw error;
  }
};
