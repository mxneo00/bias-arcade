import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/server/auth";

import GuessTheSongClient from "../../../../src/components/game/guess-the-song-client";
import styles from "./page.module.css";

export default async function GuessTheSongPage() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return (
			<div className={styles.page}>
				<main className={styles.main}>
					<section className={styles.header}>
						<div className={styles.headerRow}>
							<h1>Guess the Song</h1>
							<Link href="/games" className={styles.backLink}>
								← Back to Games
							</Link>
						</div>
						<p>Please log in to play this game.</p>
					</section>
					<Link href="/login?callbackUrl=/games/guess-the-song" className={styles.backLink}>
						Log in to continue
					</Link>
				</main>
			</div>
		);
	}

	return <GuessTheSongClient />;
}

