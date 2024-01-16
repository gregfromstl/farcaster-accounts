"use client";
import { Button } from "@components/button";
import { usePrivy } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useEffect } from "react";
import { useState } from "react";
import { useAccount } from "wagmi";

const ConnectWalletButton = () => {
    const [isReady, setIsReady] = useState(false);

    const { login } = usePrivy();
    const account = useAccount();
    const { wallet: activeWallet } = usePrivyWagmi();

    useEffect(() => {
        setIsReady(true);
    }, []);

    if (!isReady) return <></>;

    if (!activeWallet) {
        return <Button onClick={login}>Login</Button>;
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
            {account.address?.slice(0, 6)}...{account.address?.slice(-4)}
        </div>
    );
};

export default ConnectWalletButton;
