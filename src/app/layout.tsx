import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next/types";
import { Toaster } from "react-hot-toast";
import Web3Wrapper from "@/components/Web3Wrapper";
import Image from "next/image";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import SettingsButton from "@/components/SettingsButton";
import NewAccountButton from "@/components/NewAccountButton";

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
                    className={`w-screen px-8 overflow-x-hidden max-w-7xl overflow-y-scroll h-screen mx-auto ${inter.className}`}
                >
                    <Toaster
                        toastOptions={{
                            className: "border rounded-md",
                            position: "top-right",
                        }}
                    />
                    <div className="w-full py-4 justify-between flex items-center">
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
                        <div className="items-center flex gap-4">
                            <ConnectWalletButton />
                            <SettingsButton />
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-4 py-24">
                        <div className="w-full flex justify-between">
                            <div />
                            <div className="flex gap-2">
                                <NewAccountButton />
                            </div>
                        </div>
                        {children}
                    </div>
                </body>
            </Web3Wrapper>
        </html>
    );
}
