import styles from "./page.module.css";
import { BadgeCard } from "./badge-card";

const collectionSections = [
	{
		title: "Featured Biases",
		description: "Your highlighted picks and top favorites will appear here.",
	},
	{
		title: "Unlocked Cards",
		description: "Cards earned from game sessions will be grouped in this area.",
	},
	{
		title: "Recent Additions",
		description: "The newest items in your collection will be listed first.",
	},
];

export function BadgeGrid() {
	return (
		<section className={styles.grid} aria-label="Collection sections">
			{collectionSections.map((section) => (
				<BadgeCard
					key={section.title}
					title={section.title}
					description={section.description}
				/>
			))}
		</section>
	);
}
