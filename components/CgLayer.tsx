"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CgLayer.module.css";

interface Props {
  src: string;
  onMissing?: (resourceType: "cg", src: string) => void;
}

export default function CgLayer({ src, onMissing }: Props) {
  const [displayed, setDisplayed] = useState(src);
  const [visible, setVisible] = useState(!!src);
  const [missing, setMissing] = useState(false);
  const prevSrc = useRef(src);

  useEffect(() => {
    if (src !== prevSrc.current) {
      if (!src) {
        setVisible(false);
        const t = setTimeout(() => {
          setDisplayed("");
          prevSrc.current = src;
        }, 500);
        return () => clearTimeout(t);
      }
      setVisible(false);
      const t = setTimeout(() => {
        setDisplayed(src);
        setVisible(true);
        prevSrc.current = src;
      }, 300);
      return () => clearTimeout(t);
    }
  }, [src]);

  useEffect(() => {
    if (!displayed) {
      setMissing(false);
      return;
    }
    const img = new Image();
    img.onload = () => setMissing(false);
    img.onerror = () => {
      setMissing(true);
      onMissing?.("cg", displayed);
    };
    img.src = displayed;
  }, [displayed, onMissing]);

  if (!displayed) return null;

  return (
    <div
      className={`${styles.cg} ${visible ? styles.visible : styles.hidden}`}
      style={{ backgroundImage: `url(${displayed})` }}
    >
      {missing && (
        <div className={styles.missingHint}>Missing CG: {displayed}</div>
      )}
    </div>
  );
}
