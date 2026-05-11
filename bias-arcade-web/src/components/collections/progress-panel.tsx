"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

type ProgressData = {
    totalBadges: number;
    unlockedBadges: number;
    claimedBadges: number;
};

export function ProgressPanel() {
    const [progress, setProgress] = useState<ProgressData>({
        totalBadges: 0,
        unlockedBadges: 0,
        claimedBadges: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const response = await fetch("/api/collections/progress");
            const data = await response.json();
            const items = data.collectionItems;

            setProgress({
                totalBadges: items.length,
                unlockedBadges: items.filter((item: any) => item.badge.status === "unlocked").length,
                claimedBadges: data.claimedBadges.length,
            });
        } catch (error) {
            console.error("Error fetching progress data:", error);
        } finally {
            setLoading(false);
        }
    };

    const percentage = progress.totalBadges > 0 ? (progress.unlockedBadges / progress.totalBadges) * 100 : 0;

    if (loading) {
        return <p>Loading progress...</p>;
    }

	return (
		<section className={styles.progressPanel} aria-label="Collection progress">
            <h2>Collection Progress</h2>
            <p>
                {progress.claimedBadges} of {progress.totalBadges} badges claimed
                ({progress.unlockedBadges} unlocked)
            </p>
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${percentage}%` }}></div>
            </div>
            <span className={styles.progressText}>{Math.round(percentage)}% Complete</span>
        </section>
	);
}
