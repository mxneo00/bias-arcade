import styles from "./page.module.css";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/server/auth";
import { adminDb } from "@/server/firebase-admin";
import { SiteHeader } from "@/components/layout/site-header";
import { GameStats } from "@/lib/collections/types";

const GAME_LABELS: Record<string, string> = {
  guess_the_song: "Guess the Song",
  save_one_drop_one_song: "Save One Drop One Song",
};

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = Boolean(session?.user);

  let lastSession: GameStats | null = null;
  if (session?.user?.id) {
    try {
      const userSnap = await adminDb.collection("users").doc(session.user.id).get();
      const history: GameStats[] = userSnap.data()?.stats?.gameHistory ?? [];
      lastSession = history.at(-1) ?? null;
    } catch {
      // silently fail — homepage shouldn't break if stats are unavailable
    }
  }

  return (
    <div className={styles.page}>
      <SiteHeader isLoggedIn={isLoggedIn} />

      <main className={styles.main}>
        {isLoggedIn ? (
          <>
            <section className={styles.dashboardPrimary}>
              <p className={styles.eyebrow}>Dashboard</p>
              <h1>Ready for your next round?</h1>
              <p>
                Pick a game and jump in whenever you&apos;re ready.
              </p>
              <div className={styles.ctas}>
                <Link href="/games" className={styles.primary}>
                  Play Now
                </Link>
              </div>
              <p className={styles.hint}>
                A PREMIUM Spotify subscription is required.{" "}
                <Link href="/profile">Check your profile</Link> to verify your connection.
              </p>
            </section>

            <section className={styles.dashboardSecondary}>
              <h2>What&apos;s next</h2>
              <div className={styles.secondaryGrid}>
                <article className={styles.miniCard}>
                  <h3>Daily Challenge</h3>
                  <p>Daily challenge functionality will be added soon.</p>
                  <span className={styles.meta}>Coming soon</span>
                </article>

                <article className={styles.miniCard}>
                  <h3>Last Session Summary</h3>
                  {lastSession ? (
                    <>
                      <p>{GAME_LABELS[lastSession.gameId] ?? lastSession.gameId}</p>
                      <div className={styles.sessionStats}>
                        <span>{lastSession.score} pts</span>
                        <span>Streak · {lastSession.streak}</span>
                      </div>
                      <span className={styles.meta}>
                        {new Date(lastSession.dateAchieved).toLocaleDateString()}
                      </span>
                    </>
                  ) : (
                    <>
                      <p>Your latest score, streak, and top result will appear here.</p>
                      <span className={styles.meta}>No session data yet</span>
                    </>
                  )}
                </article>

                <article className={styles.miniCard}>
                  <h3>Collections</h3>
                  <p>
                    See your latest unlock and visit your full collection page.
                  </p>
                  <Link href="/collection" className={styles.secondaryLink}>
                    Go to Collections
                  </Link>
                </article>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className={styles.hero}>
              <p className={styles.eyebrow}>K-pop mini game hub</p>
              <h1>Play quick rounds built for your favorites.</h1>
              <p>
                Bias Arcade is a lightweight way to jump into short K-pop
                challenges. Compete in minutes, discover songs you love, and
                keep the fun going.
              </p>
              <p className={styles.hint}>
                A PREMIUM Spotify subscription is required to play.
              </p>
              <div className={styles.ctas}>
                <Link href="/login" className={styles.primary}>
                  Log In to Play
                </Link>
                <Link href="/games" className={styles.secondary}>
                  Browse Games
                </Link>
              </div>
            </section>

            <section className={styles.howItWorks}>
              <h2>How it works</h2>
              <ol className={styles.steps}>
                <li>
                  <h3>Sign in</h3>
                  <p>Create an account to access games and track your progress.</p>
                </li>
                <li>
                  <h3>Choose a game</h3>
                  <p>Pick a mode and jump in with one click.</p>
                </li>
                <li>
                  <h3>Play quick rounds</h3>
                  <p>Answer fast and keep your streak moving.</p>
                </li>
                <li>
                  <h3>Track your progress</h3>
                  <p>Earn points and track your achievements to see your progress over time.</p>
                </li>
              </ol>
            </section>

            <section className={styles.preview}>
              <h2>Preview</h2>
              <ul className={styles.previewList}>
                <li>Guess The Song rounds designed for quick sessions.</li>
                <li>Spotify connection for personalized gameplay.</li>
                <li>Simple profile hub for your game activity.</li>
              </ul>
            </section>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Bias Arcade</p>
        <nav aria-label="Footer links" className={styles.footerLinks}>
          <a href="#">About</a>
          <a href="#">Support</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </nav>
      </footer>
    </div>
  );
}
