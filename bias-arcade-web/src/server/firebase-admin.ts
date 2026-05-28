import "server-only";

import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

type ServiceAccountShape = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

function readServiceAccountFromEnv(): ServiceAccountShape | null {
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (rawServiceAccount) {
    let parsed: {
      project_id?: string;
      client_email?: string;
      private_key?: string;
    };

    try {
      parsed = JSON.parse(rawServiceAccount) as {
        project_id?: string;
        client_email?: string;
        private_key?: string;
      };
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.");
    }

    if (parsed.project_id && parsed.client_email && parsed.private_key) {
      return {
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key.replace(/\\n/g, "\n"),
      };
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }

  return null;
}

function createAdminApp(): App {
  const existing = getApps()[0];
  if (existing) {
    return existing;
  }

  const serviceAccount = readServiceAccountFromEnv();

  if (!serviceAccount) {
    throw new Error(
      "Firebase Admin SDK is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your server environment."
    );
  }

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminApp = createAdminApp();

export const adminDb = getFirestore(adminApp);