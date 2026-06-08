"use client";

import { useMemo, useState } from "react";
import { artistRegistry } from "@/lib/games/shared/artist-registry";
import { computeRoundCap } from "@/lib/games/shared/round-cap";
import { ArtistScope } from "@/lib/games/shared/scope";
import styles from "./artist-mode-selector.module.css";

type RegistryEntry = typeof artistRegistry[number];

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
    const [selections, setSelections] = useState<Set<string>>(new Set());
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState("");

    const groups = useMemo(() => artistRegistry.filter(e => e.type === "group"), []);

    const membersByFamily = useMemo(() => {
        const map = new Map<string, RegistryEntry[]>();
        for (const entry of artistRegistry) {
            if (entry.type === "solo" && entry.family) {
                if (!map.has(entry.family)) map.set(entry.family, []);
                map.get(entry.family)!.push(entry);
            }
        }
        return map;
    }, []);

    const standaloneSolos = useMemo(() => artistRegistry.filter(e => e.type === "solo" && !e.family), []);

    const searchTerm = search.trim().toLowerCase();
    const filteredEntries = useMemo(() => {
        if (!searchTerm) return null;
        return artistRegistry.filter(e => 
            e.label.toLowerCase().includes(searchTerm) ||
            e.aliases?.some(alias => alias.toLowerCase().includes(searchTerm))
        );
    }, [searchTerm]);

    function toggleEntry(id: string) {
      setSelections(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    }

    function toggleExpanded(id: string) {
      setExpandedGroups(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    }

    function estimateRounds(): number {
      return computeRoundCap(Math.max(selections.size * 150, 1), optionsCount);
    }

    function handleConfirm() {
      if (selections.size === 0) return;

      const artistIds: string[] = [];
      const labels: string[] = [];

      for (const id of selections) {
        const entry = artistRegistry.find(e => e.id === id);
        if (!entry) continue;
        artistIds.push(entry.spotifyArtistId);
        labels.push(entry.label);
      }
      const scope: ArtistScope = { type: "custom", artistIds, label: labels.join(", ") };
      onSelect(scope, estimateRounds());
      onCancel();
    }

    function renderEntry(entry: RegistryEntry, indent = false) {
        const isSelected = selections.has(entry.id);
        return (
            <div
                key={entry.id}
                className={`${styles.listRow} ${isSelected ? styles.listRowSelected : ""} ${indent ? styles.indent : ""}`}
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
            </div>
        );
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Select Groups / Artists</h2>

                <input
                    type="text"
                    placeholder="Search artists..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className={styles.searchInput}
                />

                <div className={styles.list}>
                    {filteredEntries ? (
                        filteredEntries.length === 0 ? (
                            <div className={styles.emptyState}>No results for &ldquo;{search}&rdquo;</div>
                        ) : (
                            filteredEntries.map(entry => renderEntry(entry))
                        )
                    ) : (
                        <>
                            {groups.map(group => {
                                const isExpanded = expandedGroups.has(group.id);
                                const isSelected = selections.has(group.id);
                                const members = membersByFamily.get(group.id) ?? [];
                                return (
                                    <div key={group.id}>
                                        <div className={`${styles.listRow} ${isSelected ? styles.listRowSelected : ""}`}>
                                            <label className={styles.checkLabel}>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleEntry(group.id)}
                                                    className={styles.checkbox}
                                                />
                                                <span className={styles.entryLabel}>{group.label}</span>
                                            </label>
                                            {members.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleExpanded(group.id)}
                                                    className={styles.expandBtn}
                                                    aria-label={isExpanded ? "Collapse members" : "Expand members"}
                                                >
                                                    {isExpanded ? "▲" : "▼"}
                                                </button>
                                            )}
                                        </div>
                                        {isExpanded && members.map(m => renderEntry(m, true))}
                                    </div>
                                );
                            })}
                            {standaloneSolos.map(entry => renderEntry(entry))}
                        </>
                    )}
                </div>

                {selections.size > 0 && (
                    <div className={styles.preview}>
                        <span className={styles.previewCount}>
                            {selections.size} selected · ~{estimateRounds()} rounds
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