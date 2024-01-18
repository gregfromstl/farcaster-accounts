"use client";
import NewAccountButton from "@/components/NewAccountButton";
import { GridLoader } from "react-spinners";

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
                <GridLoader color="#cccccc" />
                <span className="text-lg font-semibold text-[#cccccc]">
                    Loading...
                </span>
            </div>
        </div>
    );
}
