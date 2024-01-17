import { z } from "zod";

export const SettingsSchema = z.object({
    user: z.string(),
    neynar_api_key: z.string().nullish(),
});

export type Settings = z.infer<typeof SettingsSchema>;
