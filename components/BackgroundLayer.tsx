"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./BackgroundLayer.module.css";

interface Props {
  src: string;
  onMissing?: (resourceType: "background", src: string) => void;
}

export default function BackgroundLayer({ src, onMissing }: Props) {
  const [displayed, setDisplayed] = useState(src);
  const [visible, setVisible] = useState(true);
  const [missing, setMissing] = useState(false);
  const prevSrc = useRef(src);

  useEffect(() => {
    if (src !== prevSrc.current) {
      setVisible(false);
      const t = setTimeout(() => {
        setDisplayed(src);
        setVisible(true);
        prevSrc.current = src;
      }, 500);
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
      onMissing?.("background", displayed);
    };
    img.src = displayed;
  }, [displayed, onMissing]);

  return (
    <div
      className={`${styles.bg} ${visible ? styles.visible : styles.hidden}`}
      style={displayed ? { backgroundImage: `url(${displayed})` } : {}}
    >
      {missing && (
        <div className={styles.missingTag}>Missing background: {displayed}</div>
      )}
    </div>
  );
}
