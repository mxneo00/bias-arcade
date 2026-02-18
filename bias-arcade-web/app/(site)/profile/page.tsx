import styles from './page.module.css';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { SignOutButton } from '@/components/auth/sign-out-button';
import { SiteHeader } from '@/components/layout/site-header';
import { authOptions } from '@/server/auth';

async function getSpotifyConnectionStatus() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('spotify_access_token')?.value;

    if (!accessToken) {
        return false;
    }

    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
    });

    return response.ok;
}


export default async function Profile() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login?callbackUrl=/profile');
    }

    const displayName = session.user.name ?? 'Display name placeholder';
    const email = session.user.email ?? 'No email available';
    const avatarFallback = displayName.trim().charAt(0).toUpperCase() || 'U';
    const isSpotifyConnected = await getSpotifyConnectionStatus();

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
                                <li>Games played: --</li>
                                <li>Highest streak: --</li>
                                <li>Total score: --</li>
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
                                    <Link href="/api/integrations/spotify/login">Reconnect Spotify</Link>
                                    <Link href="/api/integrations/spotify/disconnect">Disconnect Spotify</Link>
                                </>
                            ) : (
                                <Link href="/api/integrations/spotify/login">Connect Spotify</Link>
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