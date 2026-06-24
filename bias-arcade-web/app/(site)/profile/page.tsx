import styles from './page.module.css';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { SignOutButton } from '@/components/auth/sign-out-button';
import { SiteHeader } from '@/components/layout/site-header';
import { getSpotifyConnectionStatus } from '@/lib/spotify/status';
import { authOptions } from '@/server/auth';

import { adminDb } from "@/server/firebase-admin";
import { evaluateCollection } from "@/lib/collections/evaluate";
import type { UserStats } from "@/lib/collections/types";


export default async function Profile() {
    const emptyStats: UserStats = {
        totalGamesPlayed: 0,
        averageScore: 0,
        highestScore: 0,
        currentStreak: 0,
        longestStreak: 0,
        gameHistory: [],
    };
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login?callbackUrl=/profile');
    }

    const userDocRef = adminDb.collection("users").doc(session.user.id);
    const userDocSnap = await userDocRef.get();
    const userData = userDocSnap.data();
    const stats: UserStats = (userData?.stats as UserStats | undefined) || emptyStats;
    const claimedBadges = Array.isArray(userData?.claimedBadges) ? userData.claimedBadges : [];
    const totalScore = stats.gameHistory.reduce((sum, game) => sum + game.score, 0);
    const collectionItems = evaluateCollection(stats, claimedBadges);
    const unlockedOrClaimed = collectionItems.filter(item => item.badge.status === "unlocked" || item.badge.status === "claimed").length;

    const displayName = session.user.name ?? 'Display name placeholder';
    const email = session.user.email ?? 'No email available';
    const avatarFallback = displayName.trim().charAt(0).toUpperCase() || 'U';
    const spotifyStatus = await getSpotifyConnectionStatus(await cookies());
    const isSpotifyConnected = spotifyStatus.connected;

    return (
        <div className={styles.page}>
            <SiteHeader isLoggedIn={true} />

            <main className={styles.main}>
                <div className={styles.layoutGrid}>
                    <section className={`${styles.panel} ${styles.identityPanel}`} aria-labelledby="identity-heading">
                        <h2 id="identity-heading" className={styles.sectionTitle}>Identity</h2>

                        <div className={styles.avatarRow}>
                            <div className={styles.avatar} aria-label="Avatar placeholder">{avatarFallback}</div>
                            <div className={styles.nameBlock}>
                                <p className={styles.displayName}>{displayName}</p>
                                <p className={styles.secondaryText}>{email}</p>
                            </div>
                        </div>

                        <div className={styles.placeholderBlock}>
                            <p className={styles.placeholderLabel}>Featured Card / Bias</p>
                            <p className={styles.secondaryText}>Not set yet</p>
                        </div>

                        <div className={styles.placeholderBlock}>
                            <p className={styles.placeholderLabel}>Stats Summary</p>
                            <ul className={styles.statsList}>
                                <li>Games played: {stats.totalGamesPlayed}</li>
                                <li>Highest streak: {stats.longestStreak}</li>
                                <li>Total score: {totalScore}</li>
                                <li>Average score: {Math.round(stats.averageScore)}</li>
                                <li>Badges claimed: {claimedBadges.length}/{collectionItems.length}</li>
                                <li>Badges unlocked: {unlockedOrClaimed}</li>
                            </ul>
                        </div>
                    </section>

                    <section className={`${styles.panel} ${styles.accountPanel}`} aria-labelledby="account-heading">
                        <h2 id="account-heading" className={styles.sectionTitle}>Account</h2>
                        <div className={styles.actions}>
                            {isSpotifyConnected ? (
                                <>
                                    <span className={styles.integrationStatus} aria-live="polite">
                                        Spotify Connected
                                    </span>
                                    <a href="/api/integrations/spotify/login">Reconnect Spotify</a>
                                    <a href="/api/integrations/spotify/disconnect">Disconnect Spotify</a>
                                </>
                            ) : (
                                <a href="/api/integrations/spotify/login">Connect Spotify</a>
                            )}
                            <SignOutButton className={styles.logoutButton} />
                            <Link href="/settings" className={styles.settingsButton}>
                                Settings
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}