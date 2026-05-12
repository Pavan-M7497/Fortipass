import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, orderBy } from "firebase/firestore";
import { VaultItem } from "@/types/schema";
import { encryptData, decryptData } from "@/lib/crypto";

const VAULT_COLLECTION = "vault";

export async function getVaultItems(userId: string, masterKey: CryptoKey): Promise<VaultItem[]> {
  if (!db) throw new Error("Database not initialized");

  const q = query(
    collection(db, VAULT_COLLECTION),
    where("ownerId", "==", userId),
    orderBy("updatedAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  const items: VaultItem[] = [];

  for (const doc of querySnapshot.docs) {
    const data = doc.data();
    items.push({
      id: doc.id,
      ...data,
    } as VaultItem);
  }

  return items;
}

export async function addVaultItem(
  userId: string,
  masterKey: CryptoKey,
  itemData: { title: string; username: string; password: string; url: string; notes: string; category: string; tags: string[] }
): Promise<string> {
  if (!db) throw new Error("Database not initialized");

  // Encrypt the sensitive data
  const { ciphertext, iv } = await encryptData(
    {
      title: itemData.title,
      username: itemData.username,
      password: itemData.password,
      url: itemData.url,
      notes: itemData.notes,
    },
    masterKey
  );

  const newItem = {
    ownerId: userId,
    encryptedData: ciphertext,
    iv, // Store IV separately for decryption
    category: itemData.category || "General",
    tags: itemData.tags || [],
    favorite: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const docRef = await addDoc(collection(db, VAULT_COLLECTION), newItem);
  return docRef.id;
}

export async function updateVaultItem(
  itemId: string,
  masterKey: CryptoKey,
  itemData: { title: string; username: string; password: string; url: string; notes: string; category: string; tags: string[] }
): Promise<void> {
  if (!db) throw new Error("Database not initialized");

  const { ciphertext, iv } = await encryptData(
    {
      title: itemData.title,
      username: itemData.username,
      password: itemData.password,
      url: itemData.url,
      notes: itemData.notes,
    },
    masterKey
  );

  const docRef = doc(db, VAULT_COLLECTION, itemId);
  await updateDoc(docRef, {
    encryptedData: ciphertext,
    iv,
    category: itemData.category,
    tags: itemData.tags,
    updatedAt: Date.now(),
  });
}

export async function deleteVaultItem(itemId: string): Promise<void> {
  if (!db) throw new Error("Database not initialized");
  await deleteDoc(doc(db, VAULT_COLLECTION, itemId));
}
