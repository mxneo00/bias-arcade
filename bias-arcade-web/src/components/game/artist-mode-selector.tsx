"use client";

import { useState } from "react";
import { artistRegistry } from "@/lib/games/shared/artist-registry";
import { computeRoundCap } from "@/lib/games/shared/round-cap";
import { ArtistScope } from "@/lib/games/shared/scope";
import styles from "./artist-mode-selector.module.css";

type SearchResult = { id: string; name: string };
type SelectorMode = "dropdown" | "search";

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
    const [mode, setMode] = useState<SelectorMode>("dropdown");
    const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
    const [selectedLabel, setSelectedLabel] = useState<string>("");
    const [selectedScope, setSelectedScope] = useState<"artist" | "group" | "group+solo">("group+solo");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const registryEntry = selectedArtistId 
        ? artistRegistry.find((e) => e.spotifyArtistId === selectedArtistId) 
        : null;

    const allowedScopes = registryEntry 
        ? registryEntry.type === "solo"
            ? ["artist"]
            : ["group", "group+solo"]
        : ["artist", "group", "group+solo"];

    const estimateRounds = (): number => {
        const tracksPerArtist = 150;
        let estimatedPoolSize = tracksPerArtist;

        if (selectedScope === "group+solo" && registryEntry?.memberSpotifyArtistIds?.length) {
            estimatedPoolSize = tracksPerArtist * (1 + registryEntry.memberSpotifyArtistIds.length);
        }

        return computeRoundCap(estimatedPoolSize, optionsCount);
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            setSearchError(null);
            return;
        }

        setIsSearching(true);
        setSearchError(null);

        try {
            const response = await fetch(`/api/search-artists?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error("Search failed");
            }
            const data = await response.json() as { artists?: SearchResult[] };
            setSearchResults(data.artists || []);
        } catch (error) {
            setSearchError((error as Error).message);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectFromSearch = (artist: SearchResult) => {
        setSelectedArtistId(artist.id);
        setSelectedLabel(artist.name);
        setMode("dropdown");
        setSearchQuery("");
        setSearchResults([]);
        setSelectedScope("artist");
    };

    const handleSelectFromDropdown = (artistId: string) => {
        setSelectedArtistId(artistId);
        const entry = artistRegistry.find((e) => e.id === artistId);
        setSelectedLabel(entry ? entry.label : "");
        setSelectedScope(entry ? (entry.type === "solo" ? "artist" : "group+solo") : "group+solo");
    };

    const handleConfirm = () => {
        if (!selectedArtistId) return;
        
        let scope: ArtistScope;
        if (selectedScope === "artist") {
            scope = { type: "artist", artistId: selectedArtistId, label: selectedLabel };
        } else if (selectedScope === "group") {
            scope = { type: "group", artistId: selectedArtistId, label: selectedLabel };
        } else {
            const memberIds = registryEntry?.memberSpotifyArtistIds?.filter(Boolean) || [];
            scope = { 
                type: "group+solo", 
                artistId: selectedArtistId,
                label: selectedLabel, 
                memberArtistIds: memberIds 
            };
        }

        const roundCap = estimateRounds();
        onSelect(scope, roundCap);
    };

    return (<div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Select Artist/Group</h2>

        {mode === "dropdown" ? (
          <>
            <div className={styles.section}>
              <label className={styles.sectionLabel}>Artist/Group:</label>
              <div className={styles.selectionDisplay}>
                <span>{selectedLabel || "Choose an artist..."}</span>
                <button onClick={() => setMode("search")} className={styles.searchToggle}>
                  Search
                </button>
              </div>

              <div className={styles.dropdown}>
                {artistRegistry.map((entry) => (
                  <button
                    key={entry.id}
                    className={`${styles.dropdownItem} ${
                      selectedArtistId === entry.id ? styles.active : ""
                    }`}
                    onClick={() => handleSelectFromDropdown(entry.id)}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedArtistId && (
              <>
                <div className={styles.section}>
                  <label className={styles.sectionLabel}>Scope:</label>
                  <div className={styles.radioGroup}>
                    {allowedScopes.includes("artist") && (
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="scope"
                          value="artist"
                          checked={selectedScope === "artist"}
                          onChange={() => setSelectedScope("artist")}
                        />
                        Solo artist only
                      </label>
                    )}
                    {allowedScopes.includes("group") && (
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="scope"
                          value="group"
                          checked={selectedScope === "group"}
                          onChange={() => setSelectedScope("group")}
                        />
                        Group only
                      </label>
                    )}
                    {allowedScopes.includes("group+solo") && (
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="scope"
                          value="group+solo"
                          checked={selectedScope === "group+solo"}
                          onChange={() => setSelectedScope("group+solo")}
                        />
                        Group + member solos
                      </label>
                    )}
                  </div>
                </div>

                <div className={styles.section}>
                  <div className={styles.roundsPreview}>
                    📊 ~{estimateRounds()} rounds available
                  </div>
                </div>
              </>
            )}

            <div className={styles.actions}>
              <button onClick={onCancel} className={styles.cancelBtn} disabled={isLoading}>
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={styles.confirmBtn}
                disabled={!selectedArtistId || isLoading}
              >
                {isLoading ? "Starting..." : "Start Game"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.section}>
              <input
                type="text"
                placeholder="Search artists..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={styles.searchInput}
                autoFocus
              />
              {isSearching && <div className={styles.loading}>Searching...</div>}
              {searchError && <div className={styles.error}>{searchError}</div>}
              <div className={styles.searchResultsList}>
                {searchResults.length > 0 ? (
                  searchResults.map((artist) => (
                    <button
                      key={artist.id}
                      className={styles.searchResultItem}
                      onClick={() => handleSelectFromSearch(artist)}
                    >
                      {artist.name}
                    </button>
                  ))
                ) : (
                  searchQuery && !isSearching && (
                    <div className={styles.noResults}>No results found</div>
                  )
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <button onClick={() => setMode("dropdown")} className={styles.cancelBtn}>
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}