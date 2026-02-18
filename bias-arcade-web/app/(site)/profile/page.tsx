import styles from './page.module.css';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { SignOutButton } from '@/components/auth/sign-out-button';
import { SiteHeader } from '@/components/layout/site-header';
import { authOptions } from '@/server/auth';


export default async function Profile() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login?callbackUrl=/profile');
    }

    return (
        <div className={styles.page}>
            <SiteHeader isLoggedIn={true} />

            <main className={styles.main}>
                <section className={styles.pageHeader}>
                    <h1>Profile</h1>
                    <p>Manage your account and connected services.</p>
                </section>

                <section className={styles.panel}>
                    <p className={styles.identity}>{session.user.name ?? session.user.email}</p>
                    <div className={styles.actions}>
                        <Link href="/api/integrations/spotify/login">Connect Spotify</Link>
                        <SignOutButton className={styles.logoutButton} />
                    </div>
                </section>
            </main>
        </div>
    );
}