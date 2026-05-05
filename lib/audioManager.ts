import type { Settings } from "./types";

let bgmAudio: HTMLAudioElement | null = null;
let voiceAudio: HTMLAudioElement | null = null;
let currentBgmSrc = "";

export function playBgm(src: string, settings: Settings): void {
  if (!src || settings.muted) {
    stopBgm();
    return;
  }
  if (currentBgmSrc === src && bgmAudio && !bgmAudio.paused) return;
  stopBgm();
  currentBgmSrc = src;
  bgmAudio = new Audio(src);
  bgmAudio.loop = true;
  bgmAudio.volume = settings.bgmVolume;
  bgmAudio.play().catch(() => {});
}

export function stopBgm(): void {
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
    bgmAudio = null;
  }
  currentBgmSrc = "";
}

export function playVoice(src: string, settings: Settings): void {
  if (!src || settings.muted) return;
  stopVoice();
  voiceAudio = new Audio(src);
  voiceAudio.volume = settings.voiceVolume;
  voiceAudio.play().catch(() => {});
}

export function stopVoice(): void {
  if (voiceAudio) {
    voiceAudio.pause();
    voiceAudio.currentTime = 0;
    voiceAudio = null;
  }
}

export function updateBgmVolume(volume: number, muted: boolean): void {
  if (bgmAudio) {
    bgmAudio.volume = muted ? 0 : volume;
  }
}

export function updateVoiceVolume(volume: number, muted: boolean): void {
  if (voiceAudio) {
    voiceAudio.volume = muted ? 0 : volume;
  }
}
