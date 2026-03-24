import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import styles from "./page.module.css";
import { authOptions } from "@/server/auth";
import { SiteHeader } from "@/components/layout/site-header";

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

export default async function CollectionPage() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect("/login?callbackUrl=/collection");
	}

	return (
		<div className={styles.page}>
			<SiteHeader isLoggedIn={true} />

			<main className={styles.main}>
				<section className={styles.pageHeader}>
					<h1>My Collection</h1>
					<p>Start organizing your biases, cards, and unlocks in one place.</p>
				</section>

				<section className={styles.grid} aria-label="Collection sections">
					{collectionSections.map((section) => (
						<article key={section.title} className={styles.card}>
							<h2>{section.title}</h2>
							<p>{section.description}</p>
							<span className={styles.badge}>Template Placeholder</span>
						</article>
					))}
				</section>
			</main>
		</div>
	);
}
