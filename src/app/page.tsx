import AccountsTable from "@/components/AccountsTable";
import NewAccountButton from "@/components/NewAccountButton";

export default function Home() {
    return (
        <>
            <div className="w-full flex justify-between">
                <div />
                <div className="flex gap-2">
                    <NewAccountButton />
                </div>
            </div>
            <AccountsTable />
        </>
    );
}
