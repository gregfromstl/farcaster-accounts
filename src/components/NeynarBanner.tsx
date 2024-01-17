import ServerDataApi from "@/database/ServerDataApi";
import { getUserFromCookies } from "@/util/auth";

const getSettings = async () => {
    const serverDataApi = ServerDataApi();
    const settings = await serverDataApi.getSettings();
    return settings;
};

export default async function NeynarBanner() {
    const userClaims = await getUserFromCookies();
    const settings = userClaims?.userId ? await getSettings() : null;

    if (settings?.user && !settings.neynar_api_key) {
        return (
            <div className="w-full bg-purple-500 text-white px-4 py-2 font-semibold text-center">
                You need to connect your Neynar account to generate or update
                signers. Go to settings in the top right to set your API key.
            </div>
        );
    }

    return <></>;
}
