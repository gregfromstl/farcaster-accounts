"use client";
import { FarcasterAccount } from "@/types/farcaster-account.types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/table";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { useEffect, useState } from "react";

const getAccounts = async (authToken: string) => {
    const result = await axios.get("/api/accounts", {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
    return result.data;
};

function AccountsTable({}: {}) {
    const { getAccessToken, user } = usePrivy();
    const [accounts, setAccounts] = useState<FarcasterAccount[]>([]);

    useEffect(() => {
        const refreshAccounts = async () => {
            const token = await getAccessToken();
            if (!token) {
                setAccounts([]);
                return;
            }
            const accounts = await getAccounts(token);
            setAccounts(accounts);
        };
        refreshAccounts();
    }, [user]);

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
                    <TableRow key={account.fid}>
                        <TableCell>{}</TableCell>
                        <TableCell>{}</TableCell>
                        <TableCell className="font-medium">
                            {account.fid}
                        </TableCell>
                        <TableCell>{}</TableCell>
                        <TableCell className="text-zinc-500">{}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default AccountsTable;
