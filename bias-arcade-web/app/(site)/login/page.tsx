"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

import { SiteHeader } from "@/components/layout/site-header";
import styles from "./page.module.css";

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data: session } = useSession();
	const isLoggedIn = Boolean(session?.user);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const callbackUrl = searchParams.get("callbackUrl") ?? "/";
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const result = await signIn("credentials", {
			email,
			password,
			callbackUrl,
			redirect: false,
		});

		if (!result || result.error) {
			setError("Invalid email or password.");
			setIsSubmitting(false);
			return;
		}

		router.push(result.url ?? callbackUrl);
		router.refresh();
	}

	return (
		<div className={styles.page}>
			<SiteHeader isLoggedIn={isLoggedIn} />

			<main className={styles.main}>
				<section className={styles.pageHeader}>
					<h1>Log in</h1>
					<p>Sign in to continue to Bias Arcade.</p>
				</section>

				<form className={styles.form} onSubmit={handleSubmit}>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						required
					/>

					<label htmlFor="password">Password</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						required
					/>

					{error ? <p className={styles.error}>{error}</p> : null}

					<button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Logging in..." : "Log in"}
					</button>
				</form>

				<p className={styles.meta}>
					Don&apos;t have an account? <Link href="/signup">Create one</Link>
				</p>
			</main>
		</div>
	);
}
