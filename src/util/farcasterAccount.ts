import {
    ID_GATEWAY_ADDRESS,
    ID_REGISTRY_ADDRESS,
    idGatewayABI,
    idRegistryABI,
} from "@farcaster/hub-web";
import {
    Account,
    Hex,
    createPublicClient,
    createWalletClient,
    decodeEventLog,
    http,
} from "viem";
import { optimism } from "viem/chains";
import { publicClient } from "./viemClient";

const OP_PROVIDER_URL = process.env.NEXT_PUBLIC_OP_RPC_URL as string;
const CHAIN = optimism;

const IdGateway = {
    abi: idGatewayABI,
    address: ID_GATEWAY_ADDRESS,
    chain: CHAIN,
};

const IdContract = {
    abi: idRegistryABI,
    address: ID_REGISTRY_ADDRESS,
    chain: CHAIN,
};

export const getAccountPrice = async (): Promise<bigint> => {
    return await publicClient.readContract({
        ...IdGateway,
        functionName: "price",
    });
};

export const generateFarcasterAccount = async (
    account: Account,
    recoveryAddress: Hex = "0x0000000000000000000000000000000000000000"
) => {
    const walletClient = createWalletClient({
        account: account as Account,
        chain: optimism,
        transport: http(OP_PROVIDER_URL),
    });

    const balance = await publicClient.getBalance({
        address: account.address,
    });
    // Check if we already have an fid
    const existingFid = (await publicClient.readContract({
        ...IdContract,
        functionName: "idOf",
        args: [account.address],
    })) as bigint;

    if (existingFid > BigInt(0)) {
        throw new Error("Account already registered");
    }

    const price = await getAccountPrice();
    if (balance < price) {
        throw new Error(
            `Insufficient balance to rent storage, required: ${price}, balance: ${balance}`
        );
    }
    const { request: registerRequest } = await publicClient.simulateContract({
        ...IdGateway,
        functionName: "register",
        args: [recoveryAddress],
        value: price,
    });
    const registerTxHash = await walletClient.writeContract(registerRequest);
    const registerTxReceipt = await publicClient.waitForTransactionReceipt({
        hash: registerTxHash,
    });
    // Now extract the FID from the logs
    const registerLog = decodeEventLog({
        abi: idRegistryABI,
        data: registerTxReceipt.logs[0].data,
        topics: registerTxReceipt.logs[0].topics,
    });
    const fid = parseInt((registerLog as any).args["id"]);

    return fid;
};
