import CryptoJS from 'crypto-js'

const ENCRYPTION_SECRET = import.meta.env.VITE_FIREBASE_ENCRYPTION_SECRET || 'FortiPassVaultSecret'

export function encryptValue(value: string, ownerId: string) {
  const key = `${ownerId}-${ENCRYPTION_SECRET}`
  return CryptoJS.AES.encrypt(value, key).toString()
}

export function decryptValue(ciphertext: string, ownerId: string) {
  const key = `${ownerId}-${ENCRYPTION_SECRET}`
  const bytes = CryptoJS.AES.decrypt(ciphertext, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}
