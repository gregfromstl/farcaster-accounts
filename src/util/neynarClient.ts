import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const getNeynarClient = (apiKey: string) => {
    return new NeynarAPIClient(apiKey);
};

export default getNeynarClient;
