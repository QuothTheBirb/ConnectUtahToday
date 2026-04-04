"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, SyntheticEvent, useState } from "react";
import { Form } from "@/components/form/Form";
import { FormFieldset } from "@/components/form/FormFieldset";
import { FormSection } from "@/components/form/FormSection";
import FormButton from "@/components/form/inputs/FormButton";
import FormInput from "@/components/form/inputs/FormInput";
import FormTextarea from "@/components/form/inputs/FormTextarea";

import styles from "./Auth.module.scss";

const RegisterFormInner = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const inviteCode = searchParams.get("invite");

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [organizationName, setOrganizationName] = useState("");
	const [organizationContactMethods, setOrganizationContactMethods] =
		useState({
			email: false,
			phone: false,
			website: false,
		});
	const [organizationContactEmail, setOrganizationContactEmail] = useState<
		string | null
	>(null);
	const [organizationContactPhone, setOrganizationContactPhone] = useState<
		string | null
	>(null);
	const [organizationContactPage, setOrganizationContactPage] = useState<
		string | null
	>(null);
	const [organizationDescription, setOrganizationDescription] = useState("");

	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: SyntheticEvent) => {
		event.preventDefault();

		setLoading(true);
		setError(null);

		if (password.length < 6) {
			setError("Password must be at least 6 characters long");
			setLoading(false);
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		try {
			const res = await fetch("/payload-api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password,
					name,
					inviteCode,
					organizationName,
					organizationDescription,
					organizationContactMethods,
					organizationContactEmail,
					organizationContactPhone,
					organizationContactPage,
				}),
			});

			const data = await res.json();

			if (res.ok) {
				router.push(
					"/login?message=Registration successful. Please log in.",
				);
			} else {
				setError(data.errors?.[0]?.message || "Registration failed");
			}
		} catch (err) {
			setError("An error occurred during registration");
		} finally {
			setLoading(false);
		}
	};

	if (!inviteCode) {
		return (
			<div className={styles.error}>
				<p>A valid invite code is required to register.</p>
			</div>
		);
	}

	return (
		<Form onSubmit={handleSubmit}>
			{error && <div className={styles.errorMessage}>{error}</div>}
			{/* User details */}
			<FormSection label={"User Details"}>
				<FormInput
					type={"text"}
					id={"username"}
					label={"Username"}
					value={username}
					onChange={(event) => setUsername(event.target.value)}
					required
					autoFocus
				/>
				<FormInput
					type={"password"}
					id={"password"}
					label={"Password"}
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					required
					placeholder={"Minimum 6 characters required"}
				/>
				<FormInput
					type={"password"}
					id={"confirmPassword"}
					label={"Confirm Password"}
					value={confirmPassword}
					onChange={(event) => setConfirmPassword(event.target.value)}
					required
				/>
				<FormInput
					type={"text"}
					id={"name"}
					label={"Full name (optional)"}
					value={name}
					onChange={(event) => setName(event.target.value)}
				/>
			</FormSection>
			{/* Organization details */}
			<FormSection label={"Organization"}>
				<FormInput
					type={"text"}
					id={"organizationName"}
					label={"Organization name"}
					value={organizationName}
					onChange={(event) =>
						setOrganizationName(event.target.value)
					}
					required
				/>
				<FormTextarea
					id={"organizationDescription"}
					label={"Organization description (optional)"}
					value={organizationDescription}
					onChange={(event) =>
						setOrganizationDescription(event.target.value)
					}
					placeholder="Describe your organization's mission and activities…"
				/>
				<FormFieldset
					legend={"Public contact methods for organization page"}
					description={
						"Contact methods listed on the public organization page."
					}
				>
					<FormInput
						type={"checkbox"}
						id={"enableContactEmail"}
						label={"Email"}
						checked={organizationContactMethods.email}
						onChange={(event) =>
							setOrganizationContactMethods((prevState) => ({
								...prevState,
								email: event.target.checked,
							}))
						}
					/>
					{organizationContactMethods.email && (
						<div className={styles.nested}>
							<FormInput
								type={"email"}
								id={"organizationContactEmail"}
								label={"Contact Email"}
								value={organizationContactEmail || ""}
								onChange={(e) =>
									setOrganizationContactEmail(e.target.value)
								}
								required
								placeholder="email@example.org"
							/>
						</div>
					)}
					<FormInput
						type={"checkbox"}
						id={"enableContactPhone"}
						label={"Phone"}
						checked={organizationContactMethods.phone}
						onChange={(event) =>
							setOrganizationContactMethods((prevState) => ({
								...prevState,
								phone: event.target.checked,
							}))
						}
					/>
					{organizationContactMethods.phone && (
						<div className={styles.nested}>
							<FormInput
								type={"tel"}
								id={"organizationContactPhone"}
								label={"Contact Phone"}
								value={organizationContactPhone || ""}
								onChange={(e) =>
									setOrganizationContactPhone(e.target.value)
								}
								required
								placeholder="555-555-5555"
							/>
						</div>
					)}
					<FormInput
						type={"checkbox"}
						id={"enableContactWebpage"}
						label={"Webpage"}
						checked={organizationContactMethods.website}
						onChange={(event) =>
							setOrganizationContactMethods((prevState) => ({
								...prevState,
								website: event.target.checked,
							}))
						}
					/>
					{organizationContactMethods.website && (
						<div className={styles.nested}>
							<FormInput
								type={"url"}
								id={"organizationContactPage"}
								label={"Website URL"}
								value={organizationContactPage || ""}
								onChange={(e) =>
									setOrganizationContactPage(e.target.value)
								}
								required
								placeholder="https://example.org"
							/>
						</div>
					)}
				</FormFieldset>
			</FormSection>
			<FormButton type="submit" disabled={loading}>
				{loading ? "Registering..." : "Register"}
			</FormButton>
			<div className={styles.links}>
				<p>
					Already have an account? <a href="/login">Sign in</a>
				</p>
			</div>
		</Form>
	);
};

export const RegisterForm = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<RegisterFormInner />
		</Suspense>
	);
};
