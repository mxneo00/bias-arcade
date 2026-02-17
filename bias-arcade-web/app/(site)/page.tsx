import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.intro}>
          <h1>Bias Arcade</h1>
          <p>
            Play quick K-pop mini games with your favorite groups and tracks.
            Start with Guess The Song or connect Spotify for personalized rounds.
          </p>
        </section>

        <section className={styles.ctas}>
          <Link href="/games" className={styles.primary}>
            Browse Games
          </Link>
          <Link href="/api/auth/spotify/login" className={styles.secondary}>
            Connect Spotify
          </Link>
        </section>
      </main>
    </div>
  );
}
