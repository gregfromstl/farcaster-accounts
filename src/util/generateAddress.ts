import { Wallet } from "ethers";
import { Hex } from "viem";
import { generateMnemonic, english, Address } from "viem/accounts";

export default function generateAddress() {
    const mnemonic = generateMnemonic(english, 128);
    const wallet = Wallet.fromPhrase(mnemonic);
    return {
        mnemonic,
        address: wallet.address as Address,
        privateKey: wallet.privateKey as Hex,
    } as const;
}
