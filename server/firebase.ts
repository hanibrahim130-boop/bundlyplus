import admin from "firebase-admin";

let _firestore: FirebaseFirestore.Firestore | null = null;
let _initError: string | null = null;

try {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      _initError = `Missing Firebase env vars: ${[
        !projectId && "FIREBASE_PROJECT_ID",
        !clientEmail && "FIREBASE_CLIENT_EMAIL",
        !privateKey && "FIREBASE_PRIVATE_KEY",
      ].filter(Boolean).join(", ")}`;
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
      _firestore = admin.firestore();
    }
  } else {
    _firestore = admin.firestore();
  }
} catch (e: any) {
  _initError = e?.message ?? String(e);
}

export function getFirestore(): FirebaseFirestore.Firestore {
  if (_initError) throw new Error(`Firebase init failed: ${_initError}`);
  if (!_firestore) throw new Error("Firebase not initialized");
  return _firestore;
}

export const firestore = new Proxy({} as FirebaseFirestore.Firestore, {
  get(_target, prop) {
    return (getFirestore() as any)[prop];
  },
});
