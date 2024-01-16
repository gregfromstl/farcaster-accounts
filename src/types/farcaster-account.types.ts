import { z } from "zod";
import { getAddress } from "viem";

export const FarcasterAccountSchema = z.object({
    user: z.string(),
    custodyAddress: z.string().refine((s) => getAddress(s)),
    privateKey: z.string(),
    fid: z.number(),
    signerUUID: z.string().optional(),
});

export type FarcasterAccount = z.infer<typeof FarcasterAccountSchema>;

export const FarcasterUserAccountSchema = FarcasterAccountSchema.extend({
    username: z.string().optional(),
    profileImage: z.string().url().optional(),
    displayName: z.string().optional(),
});

export type FarcasterUserAccount = z.infer<typeof FarcasterUserAccountSchema>;
