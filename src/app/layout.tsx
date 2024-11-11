import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "CollabNote",
  description: "Collaborative Markdown Editor",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
