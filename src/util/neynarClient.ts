import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const neynarClient = new NeynarAPIClient(
    process.env.NEXT_PUBLIC_NEYNAR_API_KEY as string
);

export default neynarClient;
