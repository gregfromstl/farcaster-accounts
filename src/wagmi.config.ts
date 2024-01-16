import { configureChains } from "wagmi";
import { optimism } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

export const config = configureChains(
    [optimism],
    [
        jsonRpcProvider({
            rpc: (chain) => ({
                http: process.env.NEXT_PUBLIC_OP_RPC_URL as string,
            }),
        }),
    ]
);

declare module "wagmi" {
    interface Register {
        config: typeof config;
    }
}
