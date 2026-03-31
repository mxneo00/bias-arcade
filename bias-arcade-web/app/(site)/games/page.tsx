import { getServerSession } from "next-auth";

import styles from "./page.module.css";
import { authOptions } from "@/server/auth";
import { GamePlayButton } from "@/components/game/game-play-button";
import { SiteHeader } from "@/components/layout/site-header";

const games = [
    {
        title: "Guess the Song",
        description: "Listen to a short Spotify clip and pick the correct title.",
        href: "/games/guess-the-song",
    },
    {
        title: "Save One Drop, One Song",
        description: "Choose one to save and one to drop from a pair of Spotify songs.",
        href: "/games/save-one-drop-one-song",
    },
];

export default async function GamesPage() {
    const session = await getServerSession(authOptions);
    const isLoggedIn = Boolean(session?.user);

    return (
        <div className={styles.page}>
            <SiteHeader isLoggedIn={isLoggedIn} />

            <main className={styles.main}>
                <section className={styles.pageHeader}>
                    <h1>Games Library</h1>
                    <p>Pick a mini game and start playing.</p>
                </section>

                <section className={styles.grid}>
                    {games.map((game) => (
                        <article key={game.href} className={styles.card}>
                            <h2>{game.title}</h2>
                            <p>{game.description}</p>
                            <GamePlayButton href={game.href} isLoggedIn={isLoggedIn} />
                        </article>
                    ))}
                </section>
            </main>
        </div>
    );
}