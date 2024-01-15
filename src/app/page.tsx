import ConnectWalletButton from "@/components/ConnectWalletButton";
import NewAccountButton from "@/components/NewAccountButton";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center gap-4 p-24">
            <NewAccountButton />
        </main>
    );
}
