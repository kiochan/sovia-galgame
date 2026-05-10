"use client";

import { useEffect, useState } from "react";
import styles from "./DialogBox.module.css";

interface Props {
  speaker?: string;
  text: string;
  textSpeed: number; // ms per character
  onComplete?: () => void;
}

export default function DialogBox({ speaker, text, textSpeed, onComplete }: Props) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, textSpeed);
    return () => clearInterval(interval);
  }, [text, textSpeed, onComplete]);

  return (
    <div className={styles.box}>
      {speaker && <div className={styles.speaker}>{speaker}</div>}
      <div className={styles.text}>
        {displayed}
        {!done && <span className={styles.cursor}>▌</span>}
      </div>
      {done && <div className={styles.indicator}>▼</div>}
    </div>
  );
}
