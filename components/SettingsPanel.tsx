"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSettings, resetSettings, saveSettings } from "@/lib/storage";
import type { Settings } from "@/lib/types";
import styles from "./SettingsPanel.module.css";

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Settings>({
    bgmVolume: 0.7,
    voiceVolume: 0.8,
    textSpeed: 30,
    muted: false,
  });

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSettings(next);
  }

  function handleReset() {
    const def = resetSettings();
    setSettings(def);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Link href="/" className={styles.back}>← Back</Link>
        <h2 className={styles.title}>Settings</h2>
      </div>
      <div className={styles.panel}>
        <div className={styles.row}>
          <label className={styles.label} htmlFor="bgm-volume">BGM Volume</label>
          <input
            id="bgm-volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={settings.bgmVolume}
            onChange={(e) => update("bgmVolume", Number(e.target.value))}
            className={styles.slider}
          />
          <span className={styles.value}>{Math.round(settings.bgmVolume * 100)}%</span>
        </div>
        <div className={styles.row}>
          <label className={styles.label} htmlFor="voice-volume">Voice Volume</label>
          <input
            id="voice-volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={settings.voiceVolume}
            onChange={(e) => update("voiceVolume", Number(e.target.value))}
            className={styles.slider}
          />
          <span className={styles.value}>{Math.round(settings.voiceVolume * 100)}%</span>
        </div>
        <div className={styles.row}>
          <label className={styles.label} htmlFor="text-speed">Text Speed</label>
          <input
            id="text-speed"
            type="range"
            min={10}
            max={100}
            step={5}
            value={settings.textSpeed}
            onChange={(e) => update("textSpeed", Number(e.target.value))}
            className={styles.slider}
          />
          <span className={styles.value}>{settings.textSpeed}ms/char</span>
        </div>
        <div className={styles.row}>
          <label className={styles.label} htmlFor="muted">Mute All</label>
          <input
            id="muted"
            type="checkbox"
            checked={settings.muted}
            onChange={(e) => update("muted", e.target.checked)}
            className={styles.checkbox}
          />
        </div>
        <div className={styles.footer}>
          <button type="button" className={styles.resetBtn} onClick={handleReset}>
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
