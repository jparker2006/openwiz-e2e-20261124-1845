const STORAGE_KEY = 'todos.v1';

export function load(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  if (typeof raw !== 'string' || raw.length === 0) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function save(storage, list) {
  storage.setItem(STORAGE_KEY, JSON.stringify(list));
}
