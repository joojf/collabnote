import { SignUpForm } from "@/components/auth/sign-up-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <SignUpForm />
    </div>
  );
} 