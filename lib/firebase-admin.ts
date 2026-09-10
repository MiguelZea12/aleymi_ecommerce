import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

let app: App | undefined

export function hasFirebaseAdmin(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT)
}

export function getAdminApp(): App {
  if (app) return app
  if (getApps().length) {
    app = getApps()[0]!
    return app
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT no configurado")
  }

  app = initializeApp({ credential: cert(JSON.parse(raw)) })
  return app
}

export function getAdminDb() {
  return getFirestore(getAdminApp())
}
