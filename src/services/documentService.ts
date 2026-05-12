import { db, storage } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { DocumentItem } from "@/types/schema";
import { encryptData, decryptData, arrayBufferToBase64, base64ToArrayBuffer } from "@/lib/crypto";

const DOCS_COLLECTION = "documents";

export async function uploadDocument(
  userId: string,
  masterKey: CryptoKey,
  file: File,
  category: string = "General"
): Promise<string> {
  if (!db || !storage) throw new Error("Firebase not initialized");

  // 1. Read file as ArrayBuffer
  const fileBuffer = await file.arrayBuffer();
  
  // 2. Encrypt the file content
  // Note: For large files, we might need a streaming approach, but for now we do it in memory.
  // We'll treat the file buffer as raw data to encrypt.
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    masterKey,
    fileBuffer
  );

  // 3. Upload encrypted blob to Firebase Storage
  const fileRef = ref(storage, `users/${userId}/documents/${Date.now()}_${file.name}.enc`);
  await uploadBytes(fileRef, encryptedBuffer);
  const downloadUrl = await getDownloadURL(fileRef);

  // 4. Save metadata to Firestore
  const docData = {
    ownerId: userId,
    encryptedFileUrl: downloadUrl,
    fileName: file.name, // In a real app, this should also be encrypted
    iv: arrayBufferToBase64(iv),
    category,
    fileType: file.type,
    fileSize: file.size,
    uploadedAt: Date.now(),
  };

  const docRef = await addDoc(collection(db, DOCS_COLLECTION), docData);
  return docRef.id;
}

export async function getDocuments(userId: string): Promise<DocumentItem[]> {
  if (!db) throw new Error("Database not initialized");

  const q = query(
    collection(db, DOCS_COLLECTION),
    where("ownerId", "==", userId)
  );

  const querySnapshot = await getDocs(q);
  const items: DocumentItem[] = [];

  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() } as DocumentItem);
  });

  return items;
}

export async function downloadAndDecryptDocument(
  document: DocumentItem,
  masterKey: CryptoKey
): Promise<Blob> {
  // 1. Fetch encrypted file
  const response = await fetch(document.encryptedFileUrl);
  const encryptedBuffer = await response.arrayBuffer();

  // 2. Decrypt
  const iv = base64ToArrayBuffer((document as any).iv);
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    masterKey,
    encryptedBuffer
  );

  return new Blob([decryptedBuffer], { type: document.fileType });
}
