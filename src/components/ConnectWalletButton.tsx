"use client";
import { Button } from "@components/button";
import { useEffect } from "react";
import { useState } from "react";
import {
    useAccount,
    useChainId,
    useConnect,
    useDisconnect,
    useSwitchChain,
} from "wagmi";
import { injected } from "wagmi/connectors";

const ConnectWalletButton = () => {
    const [isReady, setIsReady] = useState(false);

    const { connect } = useConnect();
    const account = useAccount();
    const { switchChain } = useSwitchChain();

    useEffect(() => {
        setIsReady(true);
    }, []);

    if (!isReady) return <></>;

    if (!account) {
        return (
            <Button onClick={() => connect({ connector: injected() })}>
                Connect
            </Button>
        );
    }

    if (account.chainId !== 10) {
        return (
            <Button onClick={() => switchChain({ chainId: 10 })}>
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
