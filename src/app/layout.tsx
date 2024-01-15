import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next/types";
import Web3Wrapper from "@/components/Web3Wrapper";
import Image from "next/image";
import ConnectWalletButton from "@/components/ConnectWalletButton";

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
                <body
                    className={`w-screen max-w-7xl overflow-y-scroll h-screen mx-auto ${inter.className}`}
                >
                    <div className="w-full p-4 px-8 justify-between flex items-center">
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
                        <ConnectWalletButton />
                    </div>
                    {children}
                </body>
            </Web3Wrapper>
        </html>
    );
}
