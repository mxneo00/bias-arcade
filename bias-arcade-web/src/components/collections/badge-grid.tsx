"use client";

import styles from "./page.module.css";
import { BadgeCard } from "./badge-card";
import { CollectionItem } from "@/lib/collections/types";
import { useEffect, useState } from "react";

export function BadgeGrid() {
	const [collection, setCollection] = useState<CollectionItem[]>([]);
	const [claimedBadges, setClaimedBadges] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCollection();
	}, []);

	const fetchCollection = async () => {
		try {
			const response = await fetch("/api/collections");
			const data = await response.json();
			setCollection(Array.isArray(data.collectionItems) ? data.collectionItems : []);
			setClaimedBadges(Array.isArray(data.claimedBadges) ? data.claimedBadges : []);
		} catch (error) {
			console.error("Error fetching collection data:", error);
		} finally {
			setLoading(false);
		}   
	};

	const handleClaim = async (badgeId: string) => {
		try {
			const response = await fetch("/api/collections", {
				method: "POST",
				body: JSON.stringify({ badgeId }),
			});

			if (response.ok) {
				setClaimedBadges([...claimedBadges, badgeId]);
			}
		} catch (error) {
			console.error("Error claiming badge:", error);
		}
	};

	if (loading) {
		return <p>Loading collection...</p>;
	}

	// Defensive: prevent runtime error if collection is undefined/null
	if (!Array.isArray(collection)) {
		return <p>No collection data available.</p>;
	}

	return (
		<section className={styles.grid}>
			{collection.map(item => (
				<BadgeCard
					key={item.badge.id}
					item={item}
					onClaim={handleClaim}
				/>
			))}
		</section>
	);
}
