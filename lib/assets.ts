import assetCatalog from "@/data/assetCatalog.json";
import type { AssetCatalog, AssetKind, AssetResource, CgEntry } from "./types";

const catalog = assetCatalog as AssetCatalog;

const collections: Record<AssetKind, AssetResource[]> = {
  background: catalog.backgrounds,
  bgm: catalog.bgm,
  voice: catalog.voice,
  sfx: catalog.sfx,
  character: catalog.characters,
  cg: catalog.cg,
};

export function getAsset(
  kind: AssetKind,
  id: string
): AssetResource | undefined {
  return collections[kind].find((asset) => asset.id === id);
}

export function resolveAssetSrc(kind: AssetKind, id?: string): string {
  if (!id) return "";
  return getAsset(kind, id)?.src ?? "";
}

export function getGalleryEntries(): CgEntry[] {
  return catalog.cg.map((entry) => ({
    id: entry.id,
    title: entry.title,
    thumbnail: entry.src,
    full: entry.src,
  }));
}
