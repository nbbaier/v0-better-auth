import { Database } from "bun:sqlite";
import { betterAuth } from "better-auth";
import { emailOTP, magicLink } from "better-auth/plugins";

export const auth = betterAuth({
	database: new Database("./sqlite.db"),
	emailAndPassword: {
		enabled: true,
	},
	account: {
		accountLinking: {
			enabled: true,
		},
	},
	plugins: [
		emailOTP({
			sendVerificationOTP: async ({ email, otp, type }) => {
				console.log("\n=== Email OTP ===");
				console.log(`To: ${email}`);
				console.log(`Type: ${type}`);
				console.log(`OTP Code: ${otp}`);
				console.log("=================\n");
			},
		}),
		magicLink({
			sendMagicLink: async ({ email, url, token }) => {
				console.log("\n=== Magic Link ===");
				console.log(`To: ${email}`);
				console.log(`Link: ${url}`);
				console.log(`Token: ${token}`);
				console.log("==================\n");
			},
		}),
	],
	trustedOrigins: ["http://localhost:5173"],
});
