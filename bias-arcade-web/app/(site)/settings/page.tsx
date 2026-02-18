import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import styles from "./page.module.css";
import { authOptions } from "@/server/auth";
import { SiteHeader } from "@/components/layout/site-header";

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
                    <p>Settings management is coming soon.</p>
                </section>

                <section className={styles.panel}>
                    <h2>Coming Soon</h2>
                    <p>
                        This page will let you update your account preferences and app settings in a
                        future release.
                    </p>
                </section>
            </main>
        </div>
    );
}
