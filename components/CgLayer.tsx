"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CgLayer.module.css";

interface Props {
  src: string;
}

export default function CgLayer({ src }: Props) {
  const [displayed, setDisplayed] = useState(src);
  const [visible, setVisible] = useState(!!src);
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

  if (!displayed) return null;

  return (
    <div
      className={`${styles.cg} ${visible ? styles.visible : styles.hidden}`}
      style={{ backgroundImage: `url(${displayed})` }}
    />
  );
}
