import type { GameState, SaveSlot, Settings } from "./types";

const SAVE_KEY = "sovia_saves";
const SETTINGS_KEY = "sovia_settings";
const UNLOCKED_CG_KEY = "sovia_unlocked_cgs";

const DEFAULT_SETTINGS: Settings = {
  bgmVolume: 0.7,
  voiceVolume: 0.8,
  textSpeed: 30,
  muted: false,
};

// Save slots
export function getSaveSlots(): SaveSlot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as SaveSlot[]) : [];
  } catch {
    return [];
  }
}

export function saveToSlot(slot: SaveSlot): void {
  const slots = getSaveSlots();
  const idx = slots.findIndex((s) => s.id === slot.id);
  if (idx >= 0) {
    slots[idx] = slot;
  } else {
    slots.push(slot);
  }
  localStorage.setItem(SAVE_KEY, JSON.stringify(slots));
}

export function deleteSaveSlot(slotId: number): void {
  const slots = getSaveSlots().filter((s) => s.id !== slotId);
  localStorage.setItem(SAVE_KEY, JSON.stringify(slots));
}

export function getSaveSlot(slotId: number): SaveSlot | undefined {
  return getSaveSlots().find((s) => s.id === slotId);
}

// Settings
export function getSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw
      ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function resetSettings(): Settings {
  localStorage.removeItem(SETTINGS_KEY);
  return DEFAULT_SETTINGS;
}

// Unlocked CGs
export function getUnlockedCgs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(UNLOCKED_CG_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function unlockCg(cgId: string): void {
  const cgs = getUnlockedCgs();
  if (!cgs.includes(cgId)) {
    cgs.push(cgId);
    localStorage.setItem(UNLOCKED_CG_KEY, JSON.stringify(cgs));
  }
}

// Game state helpers for quick save
export function buildSaveSlot(
  slotId: number,
  state: GameState,
  sceneTitle: string
): SaveSlot {
  return {
    id: slotId,
    scriptId: state.scriptId,
    currentNodeId: state.currentNodeId,
    background: state.background,
    bgm: state.bgm,
    cg: state.cg,
    unlockedCgs: state.unlockedCgs,
    sceneTitle,
    timestamp: Date.now(),
  };
}
