import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/server/auth";
import { SiteHeader } from "@/components/layout/site-header";

import SaveOneDropOneSongClient from "../../../../src/components/game/save-one-drop-one-song-client";
import styles from "./page.module.css";

export default async function SaveOneDropOneSongPage() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return (
			<div className={styles.page}>
				<SiteHeader isLoggedIn={false} />

				<main className={styles.main}>
					<section className={styles.pageHeader}>
						<div className={styles.headerRow}>
							<h1>Save One Drop, One Song</h1>
							<Link href="/games" className={styles.backLink}>
								← Back to Games
							</Link>
						</div>
						<p>Please log in to play this game.</p>
					</section>
					<Link href="/login?callbackUrl=/games/save-one-drop-one-song" className={styles.backLink}>
						Log in to continue
					</Link>
				</main>
			</div>
		);
	}

	return <SaveOneDropOneSongClient />;
}

