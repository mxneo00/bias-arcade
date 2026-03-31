import { SiteHeader } from "@/components/layout/site-header";
import { ProgressPanel } from "./progress-panel";
import { BadgeGrid } from "./badge-grid";
import styles from "./page.module.css";

export default function CollectionPageClient() {
	return (
		<div className={styles.page}>
			<SiteHeader isLoggedIn={true} />

			<main className={styles.main}>
				<section className={styles.pageHeader}>
					<h1>My Collection</h1>
					<p>Start organizing your biases, cards, and unlocks in one place.</p>
				</section>

				<ProgressPanel />
				<BadgeGrid />
			</main>
		</div>
	);
}
