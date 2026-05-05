// Script node types
export type ScriptNodeType = "scene" | "dialogue" | "choice" | "cg" | "end";

export interface SceneNode {
  id: string;
  type: "scene";
  background?: string;
  bgm?: string;
  next?: string;
}

export interface DialogueNode {
  id: string;
  type: "dialogue";
  speaker?: string;
  text: string;
  voice?: string;
  next?: string;
}

export interface ChoiceOption {
  text: string;
  next: string;
}

export interface ChoiceNode {
  id: string;
  type: "choice";
  choices: ChoiceOption[];
}

export interface CgNode {
  id: string;
  type: "cg";
  cg: string;
  unlockCgId?: string;
  next?: string;
}

export interface EndNode {
  id: string;
  type: "end";
}

export type ScriptNode =
  | SceneNode
  | DialogueNode
  | ChoiceNode
  | CgNode
  | EndNode;

export interface Script {
  id: string;
  title: string;
  start: string;
  nodes: ScriptNode[];
}

// Game state
export interface GameState {
  scriptId: string;
  currentNodeId: string;
  background: string;
  bgm: string;
  cg: string;
  unlockedCgs: string[];
}

// Save slot
export interface SaveSlot {
  id: number;
  scriptId: string;
  currentNodeId: string;
  background: string;
  bgm: string;
  cg: string;
  unlockedCgs: string[];
  sceneTitle: string;
  timestamp: number;
}

// Settings
export interface Settings {
  bgmVolume: number;
  voiceVolume: number;
  textSpeed: number; // ms per character
  muted: boolean;
}

// CG catalog entry
export interface CgEntry {
  id: string;
  title: string;
  thumbnail: string;
  full: string;
}
