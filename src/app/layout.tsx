import type { Metadata } from "next";
import { IBM_Plex_Mono, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { TRPCReactProvider } from "@/lib/trpc/client";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "devroast",
  description:
    "Drop your code below and we'll rate it — brutally honest or full roast mode",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} ${ibmPlexMono.variable} min-h-screen bg-background font-sans`}
      >
        <nav className="flex h-14 items-center justify-between border-b border-border bg-bg-page px-10">
          <Link
            href="/"
            className="flex items-center gap-2 font-jetbrains text-[18px] font-[500]"
          >
            <span className="text-accent-green">{">"}</span>
            <span className="text-text-primary">devroast</span>
          </Link>
          <Link
            href="/leaderboard"
            className="font-jetbrains text-[13px] text-text-secondary hover:text-text-primary"
          >
            leaderboard
          </Link>
        </nav>
        <main className="flex justify-center mx-auto max-w-[1440px]">
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </main>
      </body>
    </html>
  );
}
