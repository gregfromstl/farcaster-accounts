import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/table";
import AccountRow from "./AccountRow";
import ServerDataApi from "@/database/ServerDataApi";
import { getUserFromCookies } from "@/util/auth";

const getAccounts = async () => {
    const serverDataApi = ServerDataApi();
    const settings = await serverDataApi.getSettings();
    const userAccounts = settings.neynar_api_key
        ? await serverDataApi.getUserAccounts(settings.neynar_api_key)
        : [];
    return userAccounts;
};

async function AccountsTable({}: {}) {
    const userClaims = await getUserFromCookies();
    const userAccounts = userClaims?.userId ? await getAccounts() : [];

    return (
        <div className="w-full">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeader>Account</TableHeader>
                        <TableHeader>Handle</TableHeader>
                        <TableHeader>FID</TableHeader>
                        <TableHeader>Custody Address</TableHeader>
                        <TableHeader>Neynar Signer</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userAccounts.map((userAccount) => (
                        <AccountRow
                            userAccount={userAccount}
                            key={userAccount.fid}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default AccountsTable;
