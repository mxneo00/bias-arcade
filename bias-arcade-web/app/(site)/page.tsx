import styles from "./page.module.css";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/server/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = Boolean(session?.user);

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
          {isLoggedIn ? (
            <Link href="/profile" className={styles.secondary}>
              Profile
            </Link>
          ) : (
            <>
              <Link href="/login" className={styles.secondary}>
                Log In
              </Link>
              <Link href="/signup" className={styles.secondary}>
                Sign Up
              </Link>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
