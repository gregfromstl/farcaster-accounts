import AccountsTable from "@/components/AccountsTable";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import NewAccountButton from "@/components/NewAccountButton";

export default function Home() {
    return (
        <main className="flex w-full flex-col gap-4 py-24">
            <div>
                <NewAccountButton />
            </div>
            <AccountsTable accounts={[]} />
        </main>
    );
}
