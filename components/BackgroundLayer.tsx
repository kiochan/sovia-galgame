"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./BackgroundLayer.module.css";

interface Props {
  src: string;
}

export default function BackgroundLayer({ src }: Props) {
  const [displayed, setDisplayed] = useState(src);
  const [visible, setVisible] = useState(true);
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

  return (
    <div
      className={`${styles.bg} ${visible ? styles.visible : styles.hidden}`}
      style={displayed ? { backgroundImage: `url(${displayed})` } : {}}
    />
  );
}
