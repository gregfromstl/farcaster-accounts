import AccountsTable from "@/components/AccountsTable";
import NewAccountButton from "@/components/NewAccountButton";

export default function Home() {
    return (
        <main className="flex w-full flex-col gap-4 py-24">
            <div className="w-full flex justify-end">
                <NewAccountButton />
            </div>
            <AccountsTable accounts={[]} />
        </main>
    );
}
