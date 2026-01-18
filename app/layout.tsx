
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "LegalIntake AI | Smart Client Onboarding",
    description: "Automate your legal intake with AI. Secure, chat-based onboarding that screens clients and generates instant case reports.",
    keywords: ["legal tech", "ai intake", "law firm automation", "client onboarding", "legal chatbot"],
    openGraph: {
        title: "LegalIntake AI",
        description: "Automate your legal intake with AI.",
        type: "website",
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
            >
                {children}
            </body>
        </html>
    );
}
