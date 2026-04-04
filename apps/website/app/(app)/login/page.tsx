import { Metadata } from "next";

import { LoginForm } from "@/components/Auth/LoginForm";
import { PageCard } from "@/components/PageCard";
import { PageHeading } from "@/components/PageHeading";

export const metadata: Metadata = {
	title: "Login",
};

export default function LoginPage() {
	return (
		<PageCard>
			<PageHeading heading="h1">Organizer Login</PageHeading>
			<LoginForm />
		</PageCard>
	);
}
