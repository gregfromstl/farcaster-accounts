import { Database } from "@/types/database.types";

export type Row<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Row"];
export type Insert<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Insert"];
export type Update<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Update"];
export type Table = Database["public"]["Tables"];
