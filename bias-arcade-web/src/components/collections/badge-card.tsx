import styles from "./page.module.css";
import { CollectionItem } from "@/lib/collections/types";

type BadgeCardProps = {
	item: CollectionItem;
	onClaim?: (badgeId: string) => void;
};

export function BadgeCard({ item, onClaim }: BadgeCardProps) {
	const { badge, dateUnlocked, dateClaimed } = item;
	const isClaimed = badge.status === "claimed";
	const isUnlocked = badge.status === "unlocked";

	return (
		<article className={`${styles.card} ${styles[badge.status]}`}>
			<img src={badge.imageUrl} alt={badge.name} />
			<h2>{badge.name}</h2>
			<p>{badge.description}</p>
			{isUnlocked && !isClaimed && (
				<button onClick={() => onClaim?.(badge.id)}>Claim</button>
			)}
			{isClaimed && (
				<p>
					{dateClaimed
						? `Claimed on: ${new Date(dateClaimed).toLocaleDateString()}`
						: "Claimed"}
				</p>
			)}
			{!isUnlocked && !isClaimed && <p>Locked</p>}
		</article>
	);
}
