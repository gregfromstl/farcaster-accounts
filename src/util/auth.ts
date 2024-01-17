import { PrivyClient } from "@privy-io/server-auth";

const privy = new PrivyClient(
    "clredtno900rrl30f9o9495g1",
    process.env.PRIVY_APP_SECRET as string
);

export async function verifyRequest(request: Request, userId: string) {
    try {
        const authToken = (request.headers.get("authorization") || "").replace(
            "Bearer ",
            ""
        );
        const verifiedClaims = await privy.verifyAuthToken(authToken);
        if (verifiedClaims.userId === userId) {
            return verifiedClaims;
        } else return false;
    } catch (e) {
        return false;
    }
}

export async function getClaims(request: Request) {
    try {
        const authToken = (request.headers.get("authorization") || "").replace(
            "Bearer ",
            ""
        );

        const verifiedClaims = await privy.verifyAuthToken(authToken);
        return verifiedClaims;
    } catch (e) {
        return false;
    }
}
