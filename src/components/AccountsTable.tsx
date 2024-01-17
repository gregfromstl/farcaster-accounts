import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/table";
import AccountRow from "./AccountRow";
import { FarcasterUserAccount } from "@/types/farcaster-account.types";

async function AccountsTable({
    userAccounts,
}: {
    userAccounts: FarcasterUserAccount[];
}) {
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
