import { Client, Account, Databases, ID, Query, Storage,Permission ,Role} from 'appwrite';
// src/lib/appwrite.js


// re-export helpers so pages can import from here
export { ID, Permission, Role ,Storage};


const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const config = {
  dbId: import.meta.env.VITE_APPWRITE_DB_ID,
  collectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID, // optional
  marketplace_collection: import.meta.env.VITE_MARKETPLACE_COLLECTION_ID,
  adminUserIds: (import.meta.env.VITE_ADMIN_USER_IDS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean),
};
export function getFilePreview(fileId) {
  if (!config.bucketId) return null;
  return storage.getFilePreview(config.bucketId, fileId);
}


export async function getCurrentUser() {
  try { return await account.get(); } catch { return null; }
}

export async function login(email, password) {
  await account.createEmailPasswordSession(email, password);
  return account.get();
}

export async function signup(email, password, name) {
  await account.create(ID.unique(), email, password, name);
  await account.createEmailPasswordSession(email, password);
  return account.get();
}

export async function logout() {
  try { await account.deleteSession('current'); } catch {}
}

export function isAdmin(user) {
  if (!user) return false;
  if (!config.adminUserIds.length) return false; 
  return config.adminUserIds.includes(user.$id);
}


export async function listAnnouncements() {
  const res = await databases.listDocuments(
    config.dbId,
    config.collectionId,
    [ Query.orderDesc('$createdAt'), Query.limit(50) ]
  );
  return res.documents;
}

export async function createAnnouncement({ title, body, pinned=false }) {
  return databases.createDocument(
    config.dbId,
    config.collectionId,
    ID.unique(),
    { title, body, pinned }
  );
}

export async function updateAnnouncement(id, data) {
  return databases.updateDocument(config.dbId, config.collectionId, id, data);
}

export async function deleteAnnouncement(id) {
  return databases.deleteDocument(config.dbId, config.collectionId, id);
}

export async function uploadFile(file) {
  if (!config.bucketId) throw new Error('Bucket not configured');
  const uploaded = await storage.createFile(config.bucketId, ID.unique(), file);
  return uploaded;
}

// export function getFilePreview(fileId) {
//   if (!config.bucketId) return null;
//   return storage.getFileView(config.bucketId, fileId);
// }