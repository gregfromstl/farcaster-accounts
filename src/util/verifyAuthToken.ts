import { PrivyClient } from "@privy-io/server-auth";

const privy = new PrivyClient(
    "clredtno900rrl30f9o9495g1",
    process.env.PRIVY_APP_SECRET as string
);

export default async function verifyRequest(request: Request, userId: string) {
    try {
        const authToken = (request.headers.get("authorization") || "").replace(
            "Bearer ",
            ""
        );
        console.log("authToken", authToken);
        const verifiedClaims = await privy.verifyAuthToken(authToken);
        if (verifiedClaims.userId === userId) {
            return true;
        } else return false;
    } catch (e) {
        return false;
    }
}
