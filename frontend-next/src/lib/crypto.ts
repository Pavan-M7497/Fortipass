/**
 * FortiPass Zero-Knowledge Crypto Module
 * 
 * Implements AES-256-GCM encryption using the Web Crypto API.
 * The master password is used to derive a strong AES key via PBKDF2.
 * Data is encrypted locally and never sent to the server in plaintext.
 */

const ENCRYPTION_ALGO = "AES-GCM";
const DERIVATION_ALGO = "PBKDF2";
const HASH_ALGO = "SHA-256";
const ITERATIONS = 100000; // High iteration count to resist brute-force

/**
 * Generates a random salt or IV.
 * @param length Length in bytes (16 for salt, 12 for IV)
 */
export function generateRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Converts a string to an ArrayBuffer.
 */
function stringToArrayBuffer(str: string): ArrayBuffer {
  return new TextEncoder().encode(str);
}

/**
 * Converts an ArrayBuffer to a Base64 string.
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converts a Base64 string to an ArrayBuffer.
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Derives a CryptoKey from a Master Password and Salt using PBKDF2.
 * @param masterPassword The plaintext master password.
 * @param salt Base64 encoded salt string (unique per user, stored in Firestore).
 */
export async function deriveKeyFromPassword(masterPassword: string, saltBase64: string): Promise<CryptoKey> {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    stringToArrayBuffer(masterPassword),
    DERIVATION_ALGO,
    false,
    ["deriveKey"]
  );

  const saltBuffer = base64ToArrayBuffer(saltBase64);

  return crypto.subtle.deriveKey(
    {
      name: DERIVATION_ALGO,
      salt: saltBuffer,
      iterations: ITERATIONS,
      hash: HASH_ALGO,
    },
    passwordKey,
    { name: ENCRYPTION_ALGO, length: 256 },
    false, // Prevent extraction of the key material
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a JSON payload using AES-256-GCM.
 * @param data The JSON object to encrypt.
 * @param key The derived AES CryptoKey.
 * @returns { ciphertext: string, iv: string } Base64 encoded result.
 */
export async function encryptData(data: Record<string, any>, key: CryptoKey): Promise<{ ciphertext: string, iv: string }> {
  const iv = generateRandomBytes(12); // 96-bit IV recommended for AES-GCM
  const encodedData = stringToArrayBuffer(JSON.stringify(data));

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: ENCRYPTION_ALGO,
      iv: iv,
    },
    key,
    encodedData
  );

  return {
    ciphertext: arrayBufferToBase64(encryptedBuffer),
    iv: arrayBufferToBase64(iv),
  };
}

/**
 * Decrypts a Base64 ciphertext back to a JSON object.
 * @param ciphertext Base64 encoded ciphertext.
 * @param ivBase64 Base64 encoded IV used during encryption.
 * @param key The derived AES CryptoKey.
 */
export async function decryptData<T>(ciphertext: string, ivBase64: string, key: CryptoKey): Promise<T> {
  const encryptedBuffer = base64ToArrayBuffer(ciphertext);
  const ivBuffer = base64ToArrayBuffer(ivBase64);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: ENCRYPTION_ALGO,
      iv: new Uint8Array(ivBuffer),
    },
    key,
    encryptedBuffer
  );

  const decryptedString = new TextDecoder().decode(decryptedBuffer);
  return JSON.parse(decryptedString) as T;
}
