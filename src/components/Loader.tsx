"use client";
import { GridLoader } from "react-spinners";

export default function Loader() {
    return (
        <div className="w-full flex-col gap-4 flex items-center justify-center">
            <GridLoader color="#cccccc" />
            <span className="text-lg font-semibold text-[#cccccc]">
                Loading...
            </span>
        </div>
    );
}
