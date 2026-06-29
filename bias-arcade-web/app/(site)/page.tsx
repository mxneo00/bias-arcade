import styles from "./page.module.css";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/server/auth";
import { SiteHeader } from "@/components/layout/site-header";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = Boolean(session?.user);
  const lastPlayed = null as
    | { title: string; modeLabel: string; href: string }
    | null;

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
                Jump back in instantly or continue from where you left off.
              </p>
              <div className={styles.ctas}>
                <Link href="/games" className={styles.primary}>
                  Play Now
                </Link>
              </div>
              <p className={styles.hint}>
                Make sure Spotify is connected before playing. NOTE: a PREMIUM Spotify subscription is required.{" "}
                <Link href="/profile">Check your profile</Link>.
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
                  <p>
                    Your latest score, streak, and top result will appear here.
                  </p>
                  <span className={styles.meta}>No session data yet</span>
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
                  <h3>Choose a game</h3>
                  <p>Pick a mode and jump in with one click.</p>
                </li>
                <li>
                  <h3>Play quick rounds</h3>
                  <p>Answer fast and keep your streak moving.</p>
                </li>
                <li>
                  <h3>Track your progress</h3>
                  <p>Sign in to keep your profile and come back anytime.</p>
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
