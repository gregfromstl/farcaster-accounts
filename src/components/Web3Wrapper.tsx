"use client";
import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import { config } from "@/wagmi.config";

export default function Web3Wrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PrivyProvider appId="clredtno900rrl30f9o9495g1">
            <PrivyWagmiConnector wagmiChainsConfig={config}>
                {/* <WagmiProvider config={config}> */}
                {children}
                {/* </WagmiProvider> */}
            </PrivyWagmiConnector>
        </PrivyProvider>
    );
}
