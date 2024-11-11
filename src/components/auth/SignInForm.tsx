"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function SignInForm({ className, ...props }: SignInFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirect: false,
            });

            if (response?.error) {
                setError("Invalid credentials");
                return;
            }

            router.push(callbackUrl);
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Sign in to your account</CardTitle>
                <CardDescription>
                    Enter your credentials below to sign in
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <div className="grid gap-2">
                    <Button variant="outline" onClick={() => signIn("google", { callbackUrl })} disabled={isLoading}>
                        {isLoading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Icons.google className="mr-2 h-4 w-4" />
                        )}
                        Continue with Google
                    </Button>
                    <Button variant="outline" onClick={() => signIn("github", { callbackUrl })} disabled={isLoading}>
                        {isLoading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Icons.gitHub className="mr-2 h-4 w-4" />
                        )}
                        Continue with GitHub
                    </Button>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
} 