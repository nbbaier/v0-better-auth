import { emailOTPClient, magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: "http://localhost:3000",
	plugins: [emailOTPClient(), magicLinkClient()],
});

export type User = typeof authClient.$Infer.Session.user;
