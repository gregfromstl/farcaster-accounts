import AccountsTable from "@/components/AccountsTable";
import NewAccountButton from "@/components/NewAccountButton";
import ServerDataApi from "@/database/ServerDataApi";
import { getUserFromCookies } from "@/util/auth";

const getData = async () => {
    const userClaims = await getUserFromCookies();
    if (!userClaims?.userId) return { userAccounts: [], settings: undefined };
    const serverDataApi = ServerDataApi();
    const settings = await serverDataApi.getSettings();
    const userAccounts = settings.neynar_api_key
        ? await serverDataApi.getUserAccounts(settings.neynar_api_key)
        : [];
    return { userAccounts, settings };
};

export default async function Home() {
    const { userAccounts, settings } = await getData();

    return (
        <>
            <div className="w-full flex justify-between">
                <div />
                <div className="flex gap-2">
                    <NewAccountButton settings={settings} />
                </div>
            </div>
            <AccountsTable userAccounts={userAccounts} />
        </>
    );
}
