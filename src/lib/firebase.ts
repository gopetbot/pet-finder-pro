import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const envVarMap: Record<string, string> = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
}

const missingVars = Object.entries(envVarMap)
  .filter(([, value]) => !value)
  .map(([key]) => key)

const requiredEnvVars = {
  apiKey: envVarMap.VITE_FIREBASE_API_KEY,
  authDomain: envVarMap.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: envVarMap.VITE_FIREBASE_PROJECT_ID,
  storageBucket: envVarMap.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVarMap.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVarMap.VITE_FIREBASE_APP_ID,
}

if (missingVars.length > 0) {
  throw new Error(
    `Missing required Firebase environment variables: ${missingVars.join(', ')}. ` +
    'Make sure your .env file contains all VITE_FIREBASE_* variables.'
  )
}

const app = initializeApp(requiredEnvVars)

export const auth = getAuth(app)
export const db = getFirestore(app)
