import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

export default function useAuthToken() {
    const { getAccessToken, user } = usePrivy();
    const [authToken, setAuthToken] = useState<string | null>(null);

    useEffect(() => {
        getAccessToken().then((token) => {
            setAuthToken(token);
        });
    }, [getAccessToken, user]);

    return { authToken };
}
