import {Metadata} from "next";
import {PageHeading} from "@/components/PageHeading";
import {LoginForm} from "@/components/Auth/LoginForm";
import {PageCard} from "@/components/PageCard";

export const metadata: Metadata = {
  title: 'Login',
}

export default function LoginPage() {
  return (
      <PageCard>
        <PageHeading heading="h1">Login</PageHeading>
        <LoginForm />
      </PageCard>
  )
}
