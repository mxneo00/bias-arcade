import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import styles from "./page.module.css";
import { authOptions } from "@/server/auth";
import { SiteHeader } from "@/components/layout/site-header";
import { SettingsClient } from "@/components/settings/settings-client";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login?callbackUrl=/settings");
    }

    return (
        <div className={styles.page}>
            <SiteHeader isLoggedIn={true} />

            <main className={styles.main}>
                <section className={styles.pageHeader}>
                    <h1>Settings</h1>
                    <p>Manage your account and game data.</p>
                </section>

                <SettingsClient currentDisplayName={session.user.name ?? null} />
            </main>
        </div>
    );
}
