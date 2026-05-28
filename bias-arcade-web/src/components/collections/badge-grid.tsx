"use client";

import styles from "./page.module.css";
import { BadgeCard } from "./badge-card";
import { CollectionItem } from "@/lib/collections/types";
import { useEffect, useState } from "react";

export function BadgeGrid() {
	const [collection, setCollection] = useState<CollectionItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCollection();
	}, []);

	const fetchCollection = async () => {
		try {
			const response = await fetch("/api/collections");
			const data = await response.json();
			setCollection(Array.isArray(data.collectionItems) ? data.collectionItems : []);
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
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ badgeId }),
			});

			if (response.ok) {
				setCollection((prev) =>
					prev.map((item) =>
						item.badge.id === badgeId
							? {
								...item,
								badge: { ...item.badge, status: "claimed" },
								dateClaimed: new Date().toISOString(),
							}
							: item
					)
				);
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
