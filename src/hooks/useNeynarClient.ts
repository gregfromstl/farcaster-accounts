import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import useSettings from "./useSettings";
import { useEffect, useState } from "react";
import getNeynarClient from "@/util/neynarClient";

export default function useNeynarClient() {
    const { settings } = useSettings();
    const apiKey = settings?.neynar_api_key;
    const [client, setClient] = useState<NeynarAPIClient | null>(null);

    useEffect(() => {
        if (!apiKey) return;
        setClient(getNeynarClient(apiKey));
    }, [apiKey]);

    return { client };
}
