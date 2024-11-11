import { SignInForm } from "@/components/auth/SignInForm";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignInForm />
    </div>
  );
} 