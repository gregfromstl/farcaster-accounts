"use client";
import { Button } from "@components/button";
import {
    useAccount,
    useChainId,
    useConnect,
    useDisconnect,
    useSwitchChain,
} from "wagmi";
import { injected } from "wagmi/connectors";

const ConnectWalletButton = () => {
    const { connect } = useConnect();
    const account = useAccount();

    const { switchChain } = useSwitchChain();

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
};

export default ConnectWalletButton;
