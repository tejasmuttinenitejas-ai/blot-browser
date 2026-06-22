import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  HISTORY: '@blot_history',
  BOOKMARKS: '@blot_bookmarks',
  SETTINGS: '@blot_settings',
};

export const DEFAULT_SETTINGS = {
  searchEngine: 'google',
  homeUrl: 'https://www.google.com',
  theme: 'dark',
  accentColor: 'red',
  saveHistory: true,
  blockTrackers: true,
  aiModel: 'llama-3.1-8b-instant',
};

export async function getHistory() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addHistoryEntry(entry) {
  try {
    const settings = await getSettings();
    if (!settings.saveHistory) return;
    const history = await getHistory();
    const filtered = history.filter((h) => h.url !== entry.url);
    filtered.unshift({ ...entry, timestamp: Date.now() });
    await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(filtered.slice(0, 500)));
  } catch (e) {
    console.warn('addHistoryEntry failed', e);
  }
}

export async function clearHistory() {
  await AsyncStorage.removeItem(KEYS.HISTORY);
}

export async function removeHistoryEntry(url) {
  const history = await getHistory();
  const filtered = history.filter((h) => h.url !== url);
  await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(filtered));
}

export async function getBookmarks() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addBookmark(entry) {
  const bookmarks = await getBookmarks();
  if (bookmarks.some((b) => b.url === entry.url)) return;
  bookmarks.unshift({ ...entry, timestamp: Date.now() });
  await AsyncStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
}

export async function removeBookmark(url) {
  const bookmarks = await getBookmarks();
  const filtered = bookmarks.filter((b) => b.url !== url);
  await AsyncStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(filtered));
}

export async function clearBookmarks() {
  await AsyncStorage.removeItem(KEYS.BOOKMARKS);
}

export async function getSettings() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(partial) {
  const current = await getSettings();
  const next = { ...current, ...partial };
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(next));
  return next;
}

export async function resetAllSettings() {
  await AsyncStorage.removeItem(KEYS.SETTINGS);
  await AsyncStorage.removeItem(KEYS.HISTORY);
  await AsyncStorage.removeItem(KEYS.BOOKMARKS);
}
