"use client";

import { useState } from "react";
import { artistRegistry } from "@/lib/games/shared/artist-registry";
import { computeRoundCap } from "@/lib/games/shared/round-cap";
import { ArtistScope } from "@/lib/games/shared/scope";
import styles from "./artist-mode-selector.module.css";

interface SelectionState {
  includeSolos: boolean;
}

interface ArtistModeSelectorProps {
    optionsCount?: number;
    onSelect: (scope: ArtistScope, estimatedRoundCap?: number) => void;
    onCancel: () => void;
    isLoading: boolean;
}

export function ArtistModeSelector({
    optionsCount = 4,
    onSelect,
    onCancel,
    isLoading,
}: ArtistModeSelectorProps) {
    const [selections, setSelections] = useState<Map<string, SelectionState>>(new Map());

    function toggleEntry(id: string) {
      setSelections(prev => {
        const next = new Map(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.set(id, { includeSolos: false });
        }
        return next;
      });
    }

    function toggleSolos(id: string) {
      setSelections(prev => {
        const next = new Map(prev);
        const current = next.get(id);
        if (current) next.set(id, { ...current, includeSolos: !current.includeSolos });
        return next;
      });
    }

    function estimateRounds(): number {
      const tracksPerArtist = 150; // very rough estimate
      let total = 0;
      for (const [id, sel] of selections.entries()) {
        const entry = artistRegistry.find(e => e.id === id);
        if (!entry) continue;
        total += tracksPerArtist;
        if (sel.includeSolos && entry.memberSpotifyArtistIds?.length) {
          total += tracksPerArtist * entry.memberSpotifyArtistIds.filter(Boolean).length;
        }
      }
      return computeRoundCap(Math.max(total, 1), optionsCount);
    }

    function handleConfirm() {
      if (selections.size === 0) return;

      const artistIds: string[] = [];
      const labels: string[] = [];

      for (const [id, sel] of selections.entries()) {
        const entry = artistRegistry.find(e => e.id === id);
        if (!entry) continue;
        artistIds.push(entry.spotifyArtistId);
        if (sel.includeSolos && entry.memberSpotifyArtistIds) {
          artistIds.push(...entry.memberSpotifyArtistIds.filter(Boolean));
        }
        labels.push(entry.label);
      }
      const scope: ArtistScope = { type: "custom", artistIds, label: labels.join(", ") };
      onSelect(scope, estimateRounds());
      onCancel(); // Close the selector after confirming
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Select Groups / Artists</h2>
                <p className={styles.subtitle}>
                    Check the groups to include. Toggle &quot;+solos&quot; to also include member solo songs.
                </p>

                <div className={styles.list}>
                    {artistRegistry.map((entry) => {
                        const isSelected = selections.has(entry.id);
                        const sel = selections.get(entry.id);
                        const hasSolos = (entry.memberSpotifyArtistIds?.filter(Boolean).length ?? 0) > 0;
                        return (
                            <div
                                key={entry.id}
                                className={`${styles.listRow} ${isSelected ? styles.listRowSelected : ""}`}
                            >
                                <label className={styles.checkLabel}>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleEntry(entry.id)}
                                        className={styles.checkbox}
                                    />
                                    <span className={styles.entryLabel}>{entry.label}</span>
                                </label>
                                {isSelected && hasSolos && (
                                    <button
                                        type="button"
                                        onClick={() => toggleSolos(entry.id)}
                                        className={`${styles.soloToggle} ${sel?.includeSolos ? styles.soloToggleOn : ""}`}
                                    >
                                        +solos
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {selections.size > 0 && (
                    <div className={styles.preview}>
                        <span className={styles.previewCount}>
                            {selections.size} selected Â· ~{estimateRounds()} rounds
                        </span>
                    </div>
                )}

                <div className={styles.actions}>
                    <button onClick={onCancel} className={styles.cancelBtn} disabled={isLoading}>
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={styles.confirmBtn}
                        disabled={selections.size === 0 || isLoading}
                    >
                        {isLoading ? "Starting..." : `Start (${selections.size})`}
                    </button>
                </div>
            </div>
        </div>
    );
}