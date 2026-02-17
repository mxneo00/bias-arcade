"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

import styles from "./page.module.css";

export default function SignupPage() {
	const router = useRouter();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setIsSubmitting(true);

		const signupResponse = await fetch("/api/auth/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				email,
				password,
			}),
		});

		if (!signupResponse.ok) {
			const data = (await signupResponse.json()) as { error?: string };
			setError(data.error ?? "Unable to create account.");
			setIsSubmitting(false);
			return;
		}

		const loginResult = await signIn("credentials", {
			email,
			password,
			callbackUrl: "/profile",
			redirect: false,
		});

		if (!loginResult || loginResult.error) {
			setError("Account created. Please log in.");
			setIsSubmitting(false);
			router.push("/login");
			return;
		}

		router.push(loginResult.url ?? "/profile");
		router.refresh();
	}

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<h1>Create account</h1>
				<form className={styles.form} onSubmit={handleSubmit}>
					<label htmlFor="name">Name</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(event) => setName(event.target.value)}
						placeholder="Optional"
					/>

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
						minLength={8}
						required
					/>

					<label htmlFor="confirm-password">Confirm password</label>
					<input
						id="confirm-password"
						type="password"
						value={confirmPassword}
						onChange={(event) => setConfirmPassword(event.target.value)}
						minLength={8}
						required
					/>

					{error ? <p className={styles.error}>{error}</p> : null}

					<button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Creating account..." : "Create account"}
					</button>
				</form>

				<p className={styles.meta}>
					Already have an account? <Link href="/login">Log in</Link>
				</p>
			</main>
		</div>
	);
}
