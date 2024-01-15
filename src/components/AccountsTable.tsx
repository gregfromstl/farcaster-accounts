import { FarcasterAccount } from "@/types/FarcasterAccount";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/table";

function AccountsTable({ accounts }: { accounts: FarcasterAccount[] }) {
    return (
        <Table className="w-full">
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
                {accounts.map((account) => (
                    <TableRow key={account.address}>
                        <TableCell>{account.displayName}</TableCell>
                        <TableCell>{account.username}</TableCell>
                        <TableCell className="font-medium">
                            {account.fid}
                        </TableCell>
                        <TableCell>{account.address}</TableCell>
                        <TableCell className="text-zinc-500">
                            {account.signerUUID}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default AccountsTable;
