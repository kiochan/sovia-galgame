"use client";

import { getGalleryEntries } from "@/lib/assets";
import { getUnlockedCgs } from "@/lib/storage";
import type { CgEntry } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./GalleryGrid.module.css";

const catalog = getGalleryEntries();

export default function GalleryGrid() {
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [preview, setPreview] = useState<CgEntry | null>(null);

  useEffect(() => {
    setUnlocked(getUnlockedCgs());
  }, []);

  function handleCgClick(entry: CgEntry) {
    if (unlocked.includes(entry.id)) {
      setPreview(entry);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Link href="/" className={styles.back}>
          Back
        </Link>
        <h2 className={styles.title}>CG Gallery</h2>
      </div>
      <div className={styles.grid}>
        {catalog.map((entry) => {
          const isUnlocked = unlocked.includes(entry.id);
          return (
            <button
              key={entry.id}
              type="button"
              className={`${styles.cell} ${isUnlocked ? styles.unlocked : styles.locked}`}
              onClick={() => handleCgClick(entry)}
              disabled={!isUnlocked}
            >
              {isUnlocked ? (
                <img
                  src={entry.thumbnail}
                  alt={entry.title}
                  className={styles.thumb}
                />
              ) : (
                <div className={styles.lockIcon}>Locked</div>
              )}
              <span className={styles.cellTitle}>
                {isUnlocked ? entry.title : "???"}
              </span>
            </button>
          );
        })}
      </div>
      {preview && (
        <div className={styles.previewOverlay}>
          <div className={styles.previewBox}>
            <img
              src={preview.full}
              alt={preview.title}
              className={styles.previewImg}
            />
            <p className={styles.previewTitle}>{preview.title}</p>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setPreview(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
