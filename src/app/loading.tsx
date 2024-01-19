import Loader from "@/components/Loader";
import NewAccountButton from "@/components/NewAccountButton";

export default async function LoadingHome() {
    return (
        <div>
            <div className="w-full flex justify-between">
                <div />
                <div className="flex gap-2">
                    <NewAccountButton />
                </div>
            </div>
            <div className="w-full py-24 flex-col gap-4 flex items-center justify-center">
                <Loader />
            </div>
        </div>
    );
}
