import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db, auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Menu Selections
export async function saveMenuSelection(userId: string, data: {
  userName: string;
  userEmail: string;
  selectedMenu: string;
  observations: string;
}) {
  const path = `responses/${userId}`;
  try {
    await setDoc(doc(db, 'responses', userId), {
      ...data,
      userId,
      submittedAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getMenuSelection(userId: string) {
  const path = `responses/${userId}`;
  try {
    const docRef = doc(db, 'responses', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function getAllResponses() {
  const path = 'responses';
  try {
    const q = query(collection(db, 'responses'), orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Admin Check
export async function isUserAdmin(email: string | null, userId?: string) {
  if (!email) return false;
  // Primary admin check (could also be in Firestore, but hardcoded for initial safety)
  if (email === 'adanx05@gmail.com') return true;
  
  if (!userId) return false;

  const path = `admins/${userId}`;
  try {
    const docRef = doc(db, 'admins', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error: any) {
    // If permission denied, it means they are not an admin
    if (error?.code === 'permission-denied' || error?.message?.includes('permissions')) {
      return false;
    }
    // Only log and throw for unexpected errors
    handleFirestoreError(error, OperationType.GET, path);
    return false;
  }
}
