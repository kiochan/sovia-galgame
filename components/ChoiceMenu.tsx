"use client";

import type { ChoiceOption } from "@/lib/types";
import styles from "./ChoiceMenu.module.css";

interface Props {
  choices: ChoiceOption[];
  onSelect: (next: string) => void;
}

export default function ChoiceMenu({ choices, onSelect }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.menu}>
        <p className={styles.prompt}>Choose your response:</p>
        {choices.map((choice) => (
          <button
            key={choice.next}
            className={styles.choice}
            onClick={() => onSelect(choice.next)}
            type="button"
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}
