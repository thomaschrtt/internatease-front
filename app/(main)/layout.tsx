import type {Metadata} from "next";
import localFont from "next/font/local";
import "../globals.css";
import React from "react";
import {Toaster} from "@/components/ui/toaster";
import {QueryProvider} from "@/app/providers/QueryProvider";
import {Nav} from "@/components/nav";

const geistSans = localFont({
    src: "../fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "InternatEase",
    description: "Application pour gerer les chambres d'internat simplement",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <QueryProvider>
            <div className="flex h-screen overflow-hidden" suppressHydrationWarning={true}>
                <Nav/>
                <main className="flex-1 overflow-y-auto pt-16 md:pl-64">
                    <div className="container mx-auto p-4 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
            <Toaster/>
        </QueryProvider>
        </body>
        </html>
    );
}
