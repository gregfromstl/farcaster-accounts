import { Address, Hex } from "viem";

export type FarcasterAccount = {
    custodyAddress: Address;
    privateKey: Hex;
    fid: string;
    signerUUID?: string;
    username?: string;
    profileImage?: string;
    displayName?: string;
};
