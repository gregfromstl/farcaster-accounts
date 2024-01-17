"use client";
import { useState } from "react";
import { TableCell, TableRow } from "@components/table";
import { FarcasterUserAccount } from "@/types/farcaster-account.types";
import AccountFormModal from "./AccountFormModal";
import toast from "react-hot-toast";
import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

function AccountRow({ userAccount }: { userAccount: FarcasterUserAccount }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <TableRow
            className="cursor-pointer hover:bg-gray-50 text-zinc-400"
            onClick={() => setIsOpen(true)}
        >
            <TableCell>
                <div className="flex gap-3 text-black items-center">
                    <div className="w-10 h-10 rounded-full border overflow-hidden relative bg-gray-100">
                        {userAccount.profile_image && (
                            <Image
                                src={userAccount.profile_image}
                                alt=""
                                fill
                                className="object-cover object-center"
                            />
                        )}
                    </div>
                    {userAccount.display_name}
                </div>
            </TableCell>
            <TableCell className="">@{userAccount.username}</TableCell>
            <TableCell className="font-medium">
                <div className="flex items-center gap-2">{userAccount.fid}</div>
            </TableCell>
            <TableCell>
                {userAccount.custody_address.slice(0, 6)}...
                {userAccount.custody_address.slice(-4)}
            </TableCell>
            <TableCell>
                <div className="gap-2 flex items-center">
                    {userAccount.signer_uuid && (
                        <>
                            <ClipboardDocumentIcon
                                onClick={(e: any) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(
                                        userAccount.signer_uuid!
                                    );
                                    toast("Copied Neynar signer to clipboard", {
                                        id: "copy-neynar-signer",
                                        position: "top-center",
                                        duration: 1500,
                                    });
                                }}
                                className="cursor-pointer w-4 h-4 hover:text-zinc-500"
                            />
                            {userAccount.signer_uuid.slice(0, 12)}...
                        </>
                    )}
                </div>
            </TableCell>
            <AccountFormModal
                isOpen={isOpen}
                userAccount={userAccount}
                close={() => setIsOpen(false)}
            />
        </TableRow>
    );
}

export default AccountRow;
