import { z } from "zod";
import { getAddress } from "viem";

export const FarcasterAccountSchema = z.object({
    user: z.string(),
    custody_address: z.string().refine((s) => getAddress(s)),
    private_key: z.string(),
    fid: z.number(),
    signer_uuid: z.string().optional(),
});

export type FarcasterAccount = z.infer<typeof FarcasterAccountSchema>;

export const FarcasterUserAccountSchema = FarcasterAccountSchema.extend({
    username: z.string().optional(),
    profile_image: z.string().url().optional(),
    display_name: z.string().optional(),
});

export type FarcasterUserAccount = z.infer<typeof FarcasterUserAccountSchema>;
