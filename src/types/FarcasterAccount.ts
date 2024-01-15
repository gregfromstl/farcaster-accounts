import { Address, Hex } from "viem";

export type FarcasterAccount = {
    address: Address;
    privateKey: Hex;
    fid: string;
    signerUUID: string;
    username?: string;
    profileImage?: string;
    displayName?: string;
};
