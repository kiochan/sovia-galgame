import bg from "@/data/assets/bg.json";
import bgm from "@/data/assets/bgm.json";
import cg from "@/data/assets/cg.json";
import character from "@/data/assets/character.json";
import sfx from "@/data/assets/sfx.json";
import voice from "@/data/assets/voice.json";
import type { AssetKind, AssetResource, CgEntry } from "./types";

const assets: Record<AssetKind, AssetResource[]> = {
  background: bg,
  bgm,
  voice,
  sfx,
  character,
  cg,
};

export function getAsset(
  kind: AssetKind,
  id: string
): AssetResource | undefined {
  return assets[kind].find((asset) => asset.id === id);
}

export function resolveAssetSrc(kind: AssetKind, id?: string): string {
  if (!id) return "";
  return getAsset(kind, id)?.src ?? "";
}

export function getGalleryEntries(): CgEntry[] {
  return cg.map((entry) => ({
    id: entry.id,
    title: entry.title,
    thumbnail: entry.src,
    full: entry.src,
  }));
}
