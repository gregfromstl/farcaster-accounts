"use client";
import { Button } from "@components/button";
import { usePrivy } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useEffect } from "react";
import { useState } from "react";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const ConnectWalletButton = () => {
    const [isReady, setIsReady] = useState(false);

    const { login, authenticated } = usePrivy();
    const { connect } = useConnect();
    const { wallet: activeWallet } = usePrivyWagmi();

    useEffect(() => {
        setIsReady(true);
    }, []);

    if (!isReady) return <></>;

    if (!authenticated) {
        return <Button onClick={login}>Login</Button>;
    }

    if (!activeWallet) {
        return (
            <Button
                onClick={() =>
                    connect({ chainId: 10, connector: new InjectedConnector() })
                }
            >
                Unlock Wallet
            </Button>
        );
    }

    if (activeWallet?.chainId.split(":")[1] !== "10") {
        return (
            <Button onClick={() => activeWallet?.switchChain(10)}>
                Switch Chain
            </Button>
        );
    }

    return (
        <div>
            {activeWallet.address?.slice(0, 6)}...
            {activeWallet.address?.slice(-4)}
        </div>
    );
};

export default ConnectWalletButton;
