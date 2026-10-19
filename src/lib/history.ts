export interface HistoryItem {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

const KEY = "interface-doctor-history";

export function loadHistory(): HistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, 50)));
}
