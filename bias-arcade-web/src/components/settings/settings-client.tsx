"use client";

import { FormEvent, useState } from "react";
import { signOut } from "next-auth/react";

import styles from "./settings-client.module.css";

type Props = {
    currentDisplayName: string | null;
};

export function SettingsClient({ currentDisplayName }: Props) {
    return (
        <div className={styles.sections}>
            <DisplayNameSection currentDisplayName={currentDisplayName} />
            <ResetStatsSection />
            <DeleteAccountSection />
        </div>
    );
}

function DisplayNameSection({ currentDisplayName }: { currentDisplayName: string | null }) {
    const [displayName, setDisplayName] = useState(currentDisplayName ?? "");
    const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("saving");
        setError(null);

        const res = await fetch("/api/user/display-name", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ displayName }),
        });

        if (!res.ok) {
            const data = (await res.json()) as { error?: string };
            setError(data.error ?? "Failed to update display name.");
            setStatus("error");
            return;
        }

        setStatus("success");
    }

    return (
        <section className={styles.panel}>
            <h2>Display name</h2>
            <p className={styles.description}>
                This is the name shown on your profile. Takes effect on next sign-in.
            </p>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={displayName}
                    onChange={(e) => {
                        setDisplayName(e.target.value);
                        setStatus("idle");
                    }}
                    maxLength={50}
                    placeholder="Your display name"
                    className={styles.input}
                />
                {error ? <p className={styles.error}>{error}</p> : null}
                {status === "success" ? (
                    <p className={styles.success}>Display name updated. Sign out and back in to see it.</p>
                ) : null}
                <button
                    type="submit"
                    className={styles.button}
                    disabled={status === "saving" || !displayName.trim()}
                >
                    {status === "saving" ? "Saving..." : "Save"}
                </button>
            </form>
        </section>
    );
}

function ResetStatsSection() {
    const [confirm, setConfirm] = useState(false);
    const [status, setStatus] = useState<"idle" | "resetting" | "done" | "error">("idle");

    async function handleReset() {
        if (!confirm) {
            setConfirm(true);
            return;
        }

        setStatus("resetting");

        const res = await fetch("/api/user/reset-stats", { method: "POST" });

        if (!res.ok) {
            setStatus("error");
            setConfirm(false);
            return;
        }

        setStatus("done");
        setConfirm(false);
    }

    return (
        <section className={styles.panel}>
            <h2>Game stats</h2>
            <p className={styles.description}>
                Permanently reset your scores, streaks, and game history. Badges will also be cleared.
            </p>
            {status === "done" ? (
                <p className={styles.success}>Stats have been reset.</p>
            ) : null}
            {status === "error" ? (
                <p className={styles.error}>Something went wrong. Please try again.</p>
            ) : null}
            {confirm ? (
                <div className={styles.confirmRow}>
                    <span className={styles.confirmText}>Are you sure? This cannot be undone.</span>
                    <button
                        className={`${styles.button} ${styles.buttonDanger}`}
                        onClick={() => void handleReset()}
                        disabled={status === "resetting"}
                    >
                        {status === "resetting" ? "Resetting..." : "Yes, reset"}
                    </button>
                    <button
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        onClick={() => setConfirm(false)}
                        disabled={status === "resetting"}
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    className={`${styles.button} ${styles.buttonDanger}`}
                    onClick={() => void handleReset()}
                    disabled={status === "done"}
                >
                    Reset stats
                </button>
            )}
        </section>
    );
}

function DeleteAccountSection() {
    const [confirm, setConfirm] = useState(false);
    const [status, setStatus] = useState<"idle" | "deleting" | "error">("idle");

    async function handleDelete() {
        if (!confirm) {
            setConfirm(true);
            return;
        }

        setStatus("deleting");

        const res = await fetch("/api/user/account", { method: "DELETE" });

        if (!res.ok) {
            setStatus("error");
            setConfirm(false);
            return;
        }

        await signOut({ callbackUrl: "/" });
    }

    return (
        <section className={`${styles.panel} ${styles.dangerPanel}`}>
            <h2>Delete account</h2>
            <p className={styles.description}>
                Permanently delete your account and all associated data. This cannot be undone.
            </p>
            {status === "error" ? (
                <p className={styles.error}>Something went wrong. Please try again.</p>
            ) : null}
            {confirm ? (
                <div className={styles.confirmRow}>
                    <span className={styles.confirmText}>Delete your account and all data forever?</span>
                    <button
                        className={`${styles.button} ${styles.buttonDanger}`}
                        onClick={() => void handleDelete()}
                        disabled={status === "deleting"}
                    >
                        {status === "deleting" ? "Deleting..." : "Yes, delete my account"}
                    </button>
                    <button
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        onClick={() => setConfirm(false)}
                        disabled={status === "deleting"}
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    className={`${styles.button} ${styles.buttonDanger}`}
                    onClick={() => void handleDelete()}
                >
                    Delete account
                </button>
            )}
        </section>
    );
}
