import {Metadata} from "next";
import {PageHeading} from "@/components/PageHeading";
import {RegisterForm} from "@/components/Auth/RegisterForm";
import {PageCard} from "@/components/PageCard";

export const metadata: Metadata = {
  title: 'Register',
}

export default function RegisterPage() {
  return (
    <PageCard>
      <PageHeading heading="h1">Register</PageHeading>
      <RegisterForm />
    </PageCard>
  )
}
