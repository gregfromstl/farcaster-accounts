import AccountsTable from "@/components/AccountsTable";
import NewAccountButton from "@/components/NewAccountButton";
import SettingsButton from "@/components/SettingsButton";

export default function Home() {
    return (
        <main className="flex w-full flex-col gap-4 py-24">
            <div className="w-full flex justify-end">
                <div className="flex gap-2">
                    <NewAccountButton />
                    <SettingsButton />
                </div>
            </div>
            <AccountsTable />
        </main>
    );
}
