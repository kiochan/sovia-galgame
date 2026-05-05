"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deleteSaveSlot,
  getSaveSlots,
  saveToSlot,
} from "@/lib/storage";
import type { GameState, SaveSlot } from "@/lib/types";
import styles from "./SaveSlotList.module.css";

const SLOT_COUNT = 6;

interface Props {
  mode: "save" | "load";
  currentState?: GameState;
  sceneTitle?: string;
  onClose?: () => void;
}

export default function SaveSlotList({ mode, currentState, sceneTitle = "", onClose }: Props) {
  const router = useRouter();
  const [slots, setSlots] = useState<(SaveSlot | null)[]>(Array(SLOT_COUNT).fill(null));

  useEffect(() => {
    const saved = getSaveSlots();
    const arr: (SaveSlot | null)[] = Array(SLOT_COUNT).fill(null);
    for (const s of saved) {
      if (s.id >= 1 && s.id <= SLOT_COUNT) {
        arr[s.id - 1] = s;
      }
    }
    setSlots(arr);
  }, []);

  function handleSave(slotId: number) {
    if (!currentState) return;
    const slot: SaveSlot = {
      id: slotId,
      scriptId: currentState.scriptId,
      currentNodeId: currentState.currentNodeId,
      background: currentState.background,
      bgm: currentState.bgm,
      cg: currentState.cg,
      unlockedCgs: currentState.unlockedCgs,
      sceneTitle,
      timestamp: Date.now(),
    };
    saveToSlot(slot);
    setSlots((prev) => {
      const next = [...prev];
      next[slotId - 1] = slot;
      return next;
    });
  }

  function handleLoad(slot: SaveSlot) {
    const params = new URLSearchParams({
      slotId: String(slot.id),
    });
    router.push(`/game?${params.toString()}`);
  }

  function handleDelete(slotId: number) {
    deleteSaveSlot(slotId);
    setSlots((prev) => {
      const next = [...prev];
      next[slotId - 1] = null;
      return next;
    });
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Link href="/" className={styles.back}>← Back</Link>
        <h2 className={styles.title}>{mode === "save" ? "Save Game" : "Load Game"}</h2>
        {onClose && (
          <button type="button" className={styles.close} onClick={onClose}>
            ✕
          </button>
        )}
      </div>
      <div className={styles.slots}>
        {slots.map((slot, i) => {
          const slotId = i + 1;
          return (
            <div key={slotId} className={styles.slot}>
              <div className={styles.slotInfo}>
                <span className={styles.slotNum}>Slot {slotId}</span>
                {slot ? (
                  <>
                    <span className={styles.slotTitle}>{slot.sceneTitle || "No title"}</span>
                    <span className={styles.slotTime}>
                      {new Date(slot.timestamp).toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className={styles.slotEmpty}>— Empty —</span>
                )}
              </div>
              <div className={styles.slotActions}>
                {mode === "save" && (
                  <button
                    type="button"
                    className={styles.btn}
                    onClick={() => handleSave(slotId)}
                    disabled={!currentState}
                  >
                    Save
                  </button>
                )}
                {mode === "load" && slot && (
                  <button
                    type="button"
                    className={styles.btn}
                    onClick={() => handleLoad(slot)}
                  >
                    Load
                  </button>
                )}
                {slot && (
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnDanger}`}
                    onClick={() => handleDelete(slotId)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
