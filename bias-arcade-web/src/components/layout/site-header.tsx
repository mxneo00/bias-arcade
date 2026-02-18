import Link from "next/link";

import styles from "./site-header.module.css";

type SiteHeaderProps = {
  isLoggedIn: boolean;
};

export function SiteHeader({ isLoggedIn }: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logoMark} aria-hidden="true">
          BA
        </span>
        <span className={styles.brandName}>Bias Arcade</span>
      </div>

      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/">Home</Link>
        <Link href="/games">Games</Link>
        {isLoggedIn ? (
          <Link href="/profile">Profile</Link>
        ) : (
          <>
            <Link href="/login">Log In</Link>
            <Link href="/signup" className={styles.navAccent}>
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}