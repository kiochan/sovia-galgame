"use client";

import Link from "next/link";
import styles from "./MainMenu.module.css";

export default function MainMenu() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>SOVIA</h1>
        <p className={styles.subtitle}>A Visual Novel</p>
        <nav className={styles.nav}>
          <Link href="/game" className={styles.menuItem}>
            New Game
          </Link>
          <Link href="/load" className={styles.menuItem}>
            Load Game
          </Link>
          <Link href="/gallery" className={styles.menuItem}>
            CG Gallery
          </Link>
          <Link href="/settings" className={styles.menuItem}>
            Settings
          </Link>
        </nav>
      </div>
    </div>
  );
}
