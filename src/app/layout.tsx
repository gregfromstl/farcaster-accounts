import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next/types";
import Web3Wrapper from "@/components/Web3Wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Farcaster Accounts",
    description: "A place to create and modify Farcaster accounts.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="light">
            <Web3Wrapper>
                <body className={inter.className}>{children}</body>
            </Web3Wrapper>
        </html>
    );
}
