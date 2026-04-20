/**
 * js/db.js
 * ─────────────────────────────────────────────
 * IndexedDB Abstraction Layer
 * Wraps all IDB operations in clean async/await
 * promises so the rest of the app never touches
 * the IDB API directly.
 *
 * Stores:
 *   places    — all tourism places (seed + user)
 *   favorites — set of favorited place IDs
 *   notes     — user notes keyed by place ID
 * ─────────────────────────────────────────────
 */

const DB_NAME    = 'MakkahTourismDB';
const DB_VERSION = 2;

let _db = null;

/** Open (or upgrade) the database. Returns IDBDatabase. */
async function openDatabase() {
  if (_db) return _db;

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('places')) {
        db.createObjectStore('places', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('favorites')) {
        db.createObjectStore('favorites', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }
    };

    req.onsuccess  = (e) => { _db = e.target.result; resolve(_db); };
    req.onerror    = ()  => reject(new Error('فشل فتح قاعدة البيانات'));
  });
}

/** Get all records from a store. */
async function dbGetAll(storeName) {
  const db = await openDatabase();
  return new Promise((resolve) => {
    const tx  = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror   = () => resolve([]);
  });
}

/** Insert or update a single record. */
async function dbPut(storeName, value) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(value);
    tx.oncomplete = resolve;
    tx.onerror    = () => reject(new Error(`فشل الحفظ في ${storeName}`));
  });
}

/** Delete a record by key. */
async function dbDelete(storeName, key) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(key);
    tx.oncomplete = resolve;
    tx.onerror    = () => reject(new Error(`فشل الحذف من ${storeName}`));
  });
}

/** Seed default places if the store is empty. */
async function seedIfEmpty(defaultPlaces) {
  const existing = await dbGetAll('places');
  if (existing.length === 0) {
    for (const place of defaultPlaces) {
      await dbPut('places', place);
    }
  }
}
