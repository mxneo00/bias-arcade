import { useEffect, useState } from "react";

import styles from "./volume-slider.module.css";

type SpotifyPlayerInstance = {
  setVolume: (volume: number) => Promise<void>;
};

export function VolumeControl({ player }: { player: SpotifyPlayerInstance | null }) {
  const [volume, setVolume] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("kpop_game_volume") : null;
    return saved ? Number(saved) : 0.25;
  });

  useEffect(() => {
    if (player) {
      player.setVolume(volume).catch(console.error);
    }
  }, [player, volume]);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value) / 100;
    setVolume(v);
    localStorage.setItem("kpop_game_volume", String(v));

    if (player) {
      await player.setVolume(v);
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="volume">Volume:</label>
      <input
        className={styles.slider}
        id="volume"
        type="range"
        min="0"
        max="100"
        value={Math.round(volume * 100)}
        onChange={onChange}
      />
      <span className={styles.value}>{Math.round(volume * 100)}%</span>
    </div>
  );
}