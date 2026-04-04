"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, SyntheticEvent, useState } from "react";
import { Form } from "@/components/form/Form";
import FormButton from "@/components/form/inputs/FormButton";
import FormInput from "@/components/form/inputs/FormInput";

import styles from "./Auth.module.scss";

const LoginFormInner = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const message = searchParams.get("message");

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: SyntheticEvent) => {
		event.preventDefault();

		setLoading(true);
		setError(null);

		try {
			const res = await fetch("/payload-api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password,
				}),
			});

			const data = await res.json();

			if (res.ok) {
				router.push("/");
				router.refresh();
			} else {
				setError(data.errors?.[0]?.message || "Login failed");
			}
		} catch (err) {
			setError("An error occurred during login");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			{message && <div className={styles.successMessage}>{message}</div>}
			{error && <div className={styles.errorMessage}>{error}</div>}
			<FormInput
				type={"text"}
				label={"Username"}
				id={"username"}
				value={username}
				onChange={(event) => setUsername(event.target.value)}
				required
				placeholder="Your username"
			/>
			<FormInput
				type={"password"}
				label={"Password"}
				id={"password"}
				value={password}
				onChange={(event) => setPassword(event.target.value)}
				required
				placeholder="Your password"
			/>
			<FormButton type="submit" disabled={loading}>
				{loading ? "Logging in..." : "Log In"}
			</FormButton>
			<div className={styles.links}>
				<p>
					Don't have an account?{" "}
					<a href="/register">
						{/* TODO: Replace this link with a link to a email or messaging form */}
						Request an invitation for your organization
					</a>
				</p>
			</div>
		</Form>
	);
};

export const LoginForm = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<LoginFormInner />
		</Suspense>
	);
};
