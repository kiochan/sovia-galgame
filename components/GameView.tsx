"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as AudioManager from "@/lib/audioManager";
import { getNodeById, getStartNode } from "@/lib/scriptEngine";
import {
  getSaveSlot,
  getSettings,
  getUnlockedCgs,
  saveToSlot,
  unlockCg,
} from "@/lib/storage";
import type {
  CgNode,
  ChoiceNode,
  DialogueNode,
  GameState,
  SceneNode,
  Script,
  ScriptNode,
} from "@/lib/types";
import BackgroundLayer from "./BackgroundLayer";
import CgLayer from "./CgLayer";
import ChoiceMenu from "./ChoiceMenu";
import DialogBox from "./DialogBox";
import SaveSlotList from "./SaveSlotList";
import styles from "./GameView.module.css";

function GameViewInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slotId = searchParams.get("slotId");

  const [script, setScript] = useState<Script | null>(null);
  const [node, setNode] = useState<ScriptNode | null>(null);
  const [background, setBackground] = useState("");
  const [cg, setCg] = useState("");
  const [bgm, setBgm] = useState("");
  const [unlockedCgs, setUnlockedCgs] = useState<string[]>([]);
  const [dialogDone, setDialogDone] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const settingsRef = useRef(getSettings());
  const scriptRef = useRef<Script | null>(null);

  // Load script
  useEffect(() => {
    const initialUnlocked = getUnlockedCgs();
    setUnlockedCgs(initialUnlocked);

    fetch("/api/script/prologue")
      .then((r) => r.json())
      .then((data: Script) => {
        scriptRef.current = data;
        setScript(data);

        if (slotId) {
          const slot = getSaveSlot(Number(slotId));
          if (slot) {
            setBackground(slot.background);
            setCg(slot.cg);
            setBgm(slot.bgm);
            setUnlockedCgs(slot.unlockedCgs);
            const loadedNode = getNodeById(data, slot.currentNodeId);
            setNode(loadedNode ?? getStartNode(data) ?? null);
            return;
          }
        }
        const startNode = getStartNode(data);
        setNode(startNode ?? null);
      })
      .catch(console.error);
  }, [slotId]);

  // Process node side-effects
  useEffect(() => {
    if (!node) return;
    const settings = settingsRef.current;

    if (node.type === "scene") {
      const n = node as SceneNode;
      if (n.background) setBackground(n.background);
      if (n.bgm) {
        setBgm(n.bgm);
        AudioManager.playBgm(n.bgm, settings);
      }
      // Auto-advance scene node
      if (n.next && scriptRef.current) {
        const next = getNodeById(scriptRef.current, n.next);
        if (next) setNode(next);
      }
    } else if (node.type === "cg") {
      const n = node as CgNode;
      if (n.cg) setCg(n.cg);
      if (n.unlockCgId) {
        unlockCg(n.unlockCgId);
        setUnlockedCgs((prev) =>
          prev.includes(n.unlockCgId as string) ? prev : [...prev, n.unlockCgId as string]
        );
      }
      // Auto-advance cg node
      if (n.next && scriptRef.current) {
        const next = getNodeById(scriptRef.current, n.next);
        if (next) setNode(next);
      }
    } else if (node.type === "dialogue") {
      const n = node as DialogueNode;
      setDialogDone(false);
      if (n.voice) {
        AudioManager.playVoice(n.voice, settings);
      }
    } else if (node.type === "end") {
      setGameOver(true);
    }
  }, [node]);

  const advance = useCallback(() => {
    if (!node || !scriptRef.current) return;
    if (node.type === "dialogue") {
      if (!dialogDone) {
        setDialogDone(true);
        return;
      }
      const n = node as DialogueNode;
      if (n.next) {
        const next = getNodeById(scriptRef.current, n.next);
        if (next) setNode(next);
      }
    }
  }, [node, dialogDone]);

  // Keyboard handler
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        advance();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance]);

  function handleChoice(nextId: string) {
    if (!scriptRef.current) return;
    const next = getNodeById(scriptRef.current, nextId);
    if (next) setNode(next);
  }

  function handleClick() {
    if (node?.type === "choice") return;
    if (node?.type === "end") return;
    advance();
  }

  const gameState: GameState = {
    scriptId: script?.id ?? "",
    currentNodeId: node?.id ?? "",
    background,
    bgm,
    cg,
    unlockedCgs,
  };

  if (!script || !node) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className={styles.gameOver}>
        <h2>— End —</h2>
        <button type="button" className={styles.menuBtn} onClick={() => router.push("/")}>
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper} onClick={handleClick}>
      <BackgroundLayer src={background} />
      <CgLayer src={cg} />

      {node.type === "choice" && (
        <ChoiceMenu
          choices={(node as ChoiceNode).choices}
          onSelect={handleChoice}
        />
      )}

      {node.type === "dialogue" && (
        <div className={styles.dialogArea}>
          <DialogBox
            speaker={(node as DialogueNode).speaker}
            text={(node as DialogueNode).text}
            textSpeed={settingsRef.current.textSpeed}
            onComplete={() => setDialogDone(true)}
          />
        </div>
      )}

      <div className={styles.hud}>
        <button
          type="button"
          className={styles.hudBtn}
          onClick={(e) => { e.stopPropagation(); setShowSave(true); }}
        >
          Save
        </button>
        <button
          type="button"
          className={styles.hudBtn}
          onClick={(e) => { e.stopPropagation(); router.push("/"); }}
        >
          Menu
        </button>
      </div>

      {showSave && (
        <div className={styles.saveOverlay} onClick={(e) => e.stopPropagation()}>
          <SaveSlotList
            mode="save"
            currentState={gameState}
            sceneTitle={script.title}
            onClose={() => setShowSave(false)}
          />
        </div>
      )}
    </div>
  );
}

export default function GameView() {
  return (
    <Suspense fallback={<div style={{ color: "#e8e8f0", padding: "2rem" }}>Loading...</div>}>
      <GameViewInner />
    </Suspense>
  );
}
