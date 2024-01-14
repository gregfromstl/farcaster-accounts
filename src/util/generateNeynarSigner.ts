import {
    Account,
    Address,
    PrivateKeyAccount,
    PublicClient,
    WalletClient,
    createWalletClient,
    encodeAbiParameters,
    http,
} from "viem";
import { SignedKeyRequestMetadataABI } from "@/abi/SignedKeyRequestMetadata";
import neynarClient from "./neynarClient";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";
import { SignerStatusEnum } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { publicClient } from "./viemClient";
import { KeyGatewayAbi } from "@/abi/KeyGatewayABI";

export const generateApprovedNeynarSigner = async (
    account: PrivateKeyAccount,
    walletClient: WalletClient & { account: Account }
) => {
    const KEY_GATEWAY = "0x00000000fc56947c7e7183f8ca4b62398caadf0b" as Address;
    const SIGNED_KEY_REQUEST_VALIDATOR =
        "0x00000000fc700472606ed4fa22623acf62c60553" as Address;
    try {
        // Creating a new signer and obtaining its public key and UUID.
        const { public_key: signerPublicKey, signer_uuid } =
            await neynarClient.createSigner();

        // Constants for the EIP-712 domain and request type, required for signing data.
        // DO NOT CHANGE ANY VALUES IN THESE CONSTANTS
        const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
            name: "Farcaster SignedKeyRequestValidator", // EIP-712 domain data for the SignedKeyRequestValidator.
            version: "1",
            chainId: 10,
            verifyingContract: SIGNED_KEY_REQUEST_VALIDATOR,
        };

        // DO NOT CHANGE ANY VALUES IN THIS CONSTANT
        const SIGNED_KEY_REQUEST_TYPE = [
            { name: "requestFid", type: "uint256" },
            { name: "key", type: "bytes" },
            { name: "deadline", type: "uint256" },
        ];

        // Lookup user details using the custody address.
        const { user: farcasterDeveloper } =
            await neynarClient.lookupUserByCustodyAddress(account.address);

        // Generates an expiration date for the signature
        // e.g. 1693927665
        const deadline = Math.floor(Date.now() / 1000) + 86400; // signature is valid for 1 day from now

        // Signing the key request data.
        let signature = await account.signTypedData({
            domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
            types: {
                SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
            },
            primaryType: "SignedKeyRequest",
            message: {
                requestFid: BigInt(farcasterDeveloper.fid),
                key: signerPublicKey,
                deadline: BigInt(deadline),
            },
        });

        // Encoding ABI parameters for the metadata.
        const metadata = encodeAbiParameters(
            SignedKeyRequestMetadataABI.inputs,
            [
                {
                    requestFid: BigInt(farcasterDeveloper.fid),
                    requestSigner: account.address,
                    signature: signature,
                    deadline: BigInt(deadline),
                },
            ]
        );

        // Interacting with a blockchain contract to get a nonce value.
        const developerKeyGatewayNonce = await publicClient.readContract({
            address: KEY_GATEWAY,
            abi: KeyGatewayAbi,
            functionName: "nonces",
            args: [farcasterDeveloper.custody_address as Address],
        });

        // Additional EIP-712 domain and type definitions for the key gateway.
        const KEY_GATEWAY_EIP_712_DOMAIN = {
            name: "Farcaster KeyGateway",
            version: "1",
            chainId: 10,
            verifyingContract: KEY_GATEWAY,
        };

        // Signing data for the Add operation.
        const ADD_TYPE = [
            { name: "owner", type: "address" },
            { name: "keyType", type: "uint32" },
            { name: "key", type: "bytes" },
            { name: "metadataType", type: "uint8" },
            { name: "metadata", type: "bytes" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
        ];

        signature = await account.signTypedData({
            domain: KEY_GATEWAY_EIP_712_DOMAIN,
            types: {
                Add: ADD_TYPE,
            },
            primaryType: "Add",
            message: {
                owner: account.address,
                keyType: 1,
                key: signerPublicKey,
                metadataType: 1,
                metadata: metadata,
                nonce: BigInt(developerKeyGatewayNonce),
                deadline: BigInt(deadline),
            },
        });

        const { request: registerRequest } =
            await publicClient.simulateContract({
                account: walletClient.account,
                address: KEY_GATEWAY,
                abi: KeyGatewayAbi,
                functionName: "addFor",
                args: [
                    farcasterDeveloper.custody_address as Address,
                    1,
                    signerPublicKey as Address,
                    1,
                    metadata,
                    BigInt(deadline),
                    signature,
                ],
            });
        const registerTxHash = await walletClient.writeContract(
            registerRequest
        );
        const registerTxReceipt = await publicClient.waitForTransactionReceipt({
            hash: registerTxHash,
        });

        // Polling for the signer status until it is approved.
        while (true) {
            const res = await neynarClient.lookupSigner(signer_uuid);
            if (res && res.status === SignerStatusEnum.Approved) {
                break;
            }

            await new Promise((r) => setTimeout(r, 5000));
        }

        console.log("✅ Transaction confirmed\n");
        console.log("✅ Approved signer", signer_uuid, "\n");
        return signer_uuid;
    } catch (err) {
        // Error handling, checking if it's an API response error.
        if (isApiErrorResponse(err)) {
            console.log(err.response.data);
        } else console.log(err);
    }
};
