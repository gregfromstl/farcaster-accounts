import { http, createConfig } from "wagmi";
import { optimism, sepolia } from "wagmi/chains";

export const config = createConfig({
    chains: [optimism],
    transports: {
        [optimism.id]: http(),
    },
});

declare module "wagmi" {
    interface Register {
        config: typeof config;
    }
}
