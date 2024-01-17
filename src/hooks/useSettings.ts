import { Settings } from "@/types/settings.types";
import useAuthToken from "./useAuthToken";
import { useEffect, useState } from "react";
import request from "@/util/request";

export default function useSettings() {
    const { authToken } = useAuthToken();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [settings, setSettings] = useState<Settings | null>(null);

    const refreshSettings = async () => {
        setLoading(true);
        try {
            if (!authToken) return;
            const result = await request<Settings>({
                path: "/api/settings",
                method: "GET",
                authToken,
            });
            setSettings(result);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshSettings();
    }, [authToken]);

    return { loading, error, settings };
}
