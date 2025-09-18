// Simple IndexedDB helper to store uploaded videos locally (per-browser)
// Stores metadata and Blobs so we can preview videos/images later.

export type LocalVideoRecord = {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
  videoBlob: Blob;
  videoType: string;
  imageBlob?: Blob | null;
  imageType?: string | null;
  size: number; // video size in bytes
};

export type LocalVideoSummary = {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
  size: number;
  hasImage: boolean;
  videoType: string;
};

const DB_NAME = "jara-local";
const DB_VERSION = 1;
const STORE = "videos";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveVideo(params: {
  title: string;
  description?: string;
  videoFile: File;
  imageFile?: File | null;
}): Promise<string> {
  const db = await openDB();
  const id = crypto.randomUUID();
  const record: LocalVideoRecord = {
    id,
    title: params.title,
    description: params.description,
    createdAt: Date.now(),
    videoBlob: params.videoFile,
    videoType: params.videoFile.type || "video/mp4",
    imageBlob: params.imageFile || null,
    imageType: params.imageFile?.type || null,
    size: params.videoFile.size,
  };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    const store = tx.objectStore(STORE);
    store.put(record);
  });
  db.close();
  return id;
}

export async function listVideos(): Promise<LocalVideoSummary[]> {
  const db = await openDB();
  const results: LocalVideoSummary[] = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const arr = (req.result as LocalVideoRecord[]).map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        createdAt: r.createdAt,
        size: r.size,
        hasImage: !!r.imageBlob,
        videoType: r.videoType,
      }));
      // Sort by newest first
      arr.sort((a, b) => b.createdAt - a.createdAt);
      resolve(arr);
    };
    req.onerror = () => reject(req.error);
  });
  db.close();
  return results;
}

export async function getVideoUrls(id: string): Promise<{
  videoUrl: string;
  imageUrl: string | null;
}> {
  const db = await openDB();
  const rec = await new Promise<LocalVideoRecord | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result as LocalVideoRecord | undefined);
    req.onerror = () => reject(req.error);
  });
  db.close();
  if (!rec) throw new Error("Video not found");
  const videoUrl = URL.createObjectURL(rec.videoBlob);
  const imageUrl = rec.imageBlob ? URL.createObjectURL(rec.imageBlob) : null;
  return { videoUrl, imageUrl };
}

export function revokeUrls(urls: { videoUrl?: string | null; imageUrl?: string | null }) {
  try {
    if (urls.videoUrl) URL.revokeObjectURL(urls.videoUrl);
    if (urls.imageUrl) URL.revokeObjectURL(urls.imageUrl);
  } catch {}
}
