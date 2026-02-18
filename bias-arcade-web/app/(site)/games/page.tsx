import Link from "next/link";
import { getServerSession } from "next-auth";

import styles from "./page.module.css";
import { authOptions } from "@/server/auth";

const games = [
    {
        title: "Guess the Song",
        description: "Listen to a short Spotify clip and pick the correct title.",
        href: "/games/guess-the-song",
    },
];

export default async function GamesPage() {
    const session = await getServerSession(authOptions);
    const isLoggedIn = Boolean(session?.user);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <section className={styles.header}>
                    <h1>Games Library</h1>
                    <p>Pick a mini game and start playing.</p>
                </section>

                {!isLoggedIn ? (
                    <section className={styles.notice}>
                        <p>You need to log in to play games.</p>
                        <Link href="/login?callbackUrl=/games" className={styles.linkButton}>
                            Log in to continue
                        </Link>
                    </section>
                ) : null}

                <section className={styles.grid}>
                    {games.map((game) => (
                        <article key={game.href} className={styles.card}>
                            <h2>{game.title}</h2>
                            <p>{game.description}</p>
                            <Link
                                href={isLoggedIn ? game.href : "/login?callbackUrl=/games"}
                                className={styles.linkButton}
                            >
                                Play
                            </Link>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    );
}