import { Account, Address, createWalletClient, http, parseEther } from "viem";
import { optimism } from "viem/chains";
import { publicClient } from "./viemClient";

export default async function refund(account: Account, to: Address) {
    const balance = await publicClient.getBalance({ address: account.address });
    const gasReserve = parseEther("0.0001");

    if (balance > gasReserve) {
        const amountToSend = balance - gasReserve;
        const newWalletClient = createWalletClient({
            account,
            chain: optimism,
            transport: http(process.env.NEXT_PUBLIC_OP_RPC_URL),
        });
        const txHash = await newWalletClient.sendTransaction({
            to,
            value: amountToSend,
        });
    }
}
