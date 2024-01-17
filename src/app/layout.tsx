import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next/types";
import { Toaster } from "react-hot-toast";
import Web3Wrapper from "@/components/Web3Wrapper";
import Image from "next/image";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import SettingsButton from "@/components/SettingsButton";
import NeynarBanner from "@/components/NeynarBanner";
import Link from "next/link";

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
            <body>
                <Web3Wrapper>
                    <div className="min-h-screen flex flex-col">
                        <NeynarBanner />
                        <Toaster
                            toastOptions={{
                                className: "border rounded-md",
                                position: "top-right",
                            }}
                        />
                        <div
                            className={`w-screen flex-1 flex flex-col px-8 overflow-x-hidden py-2 max-w-7xl mx-auto ${inter.className}`}
                        >
                            <header className="w-full py-4 justify-between flex flex-col md:flex-row gap-3 md:items-center">
                                <span className="flex gap-2 items-center text-2xl font-bold">
                                    <Image
                                        src="/farcaster.svg"
                                        alt="Farcaster"
                                        width={564}
                                        height={564}
                                        className="w-8 h-8 rounded-md"
                                    />
                                    Farcaster Accounts
                                </span>
                                <div className="items-center flex gap-3">
                                    <ConnectWalletButton />
                                    <SettingsButton />
                                </div>
                            </header>
                            <main className="flex flex-1 w-full flex-col gap-4 py-24">
                                {children}
                            </main>
                            <footer className="w-full text-zinc-400 text-sm py-2 flex justify-end">
                                <span className="flex gap-1">
                                    Made by{" "}
                                    <Link
                                        className="underline"
                                        href="https://warpcast.com/gregfromstl"
                                        target="_blank"
                                    >
                                        @gregfromstl
                                    </Link>
                                    🤟
                                </span>
                            </footer>
                        </div>
                    </div>
                </Web3Wrapper>
            </body>
        </html>
    );
}
