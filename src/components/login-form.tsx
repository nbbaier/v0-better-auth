"use client";

import { KeyRound, Mail } from "lucide-react";
import type React from "react";
import { useId, useState } from "react";
import { authClient, type User } from "../lib/auth-client";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface LoginFormProps {
	onAuthSuccess: (user: User) => void;
}

export function LoginForm({ onAuthSuccess }: LoginFormProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [otp, setOtp] = useState("");
	const [otpSent, setOtpSent] = useState(false);
	const [magicLinkSent, setMagicLinkSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [isSignUp, setIsSignUp] = useState(false);

	const handleSendOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await authClient.emailOtp.sendVerificationOtp({
				email,
				type: "sign-in",
			});
			setOtpSent(true);
			console.log(`OTP sent to ${email}. Check server console for code.`);
		} catch (error) {
			console.error("Failed to send OTP:", error);
			setError("Failed to send OTP. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const result = await authClient.signIn.emailOtp({
				email,
				otp,
			});

			if (result?.data?.user) {
				if (name && name !== result.data.user.name) {
					await authClient.updateUser({
						name,
					});
				}
				onAuthSuccess(result.data.user);
				console.log("OTP verified successfully");
			}
		} catch (error: unknown) {
			console.error("Failed to verify OTP:", error);
			setError(
				error instanceof Error
					? error.message
					: "Invalid OTP. Please try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleSendMagicLink = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await authClient.signIn.magicLink({
				email,
				name,
				callbackURL: "/",
			});
			setMagicLinkSent(true);
			console.log(
				`Magic link sent to ${email}. Check server console for link.`,
			);
		} catch (error) {
			console.error("Failed to send magic link:", error);
			setError("Failed to send magic link. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleEmailPasswordAuth = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			if (isSignUp) {
				const result = await authClient.signUp.email({
					email,
					password,
					name,
					callbackURL: "/",
				});

				if (result?.data?.user) {
					onAuthSuccess(result.data.user);
					console.log("Sign up successful");
				}
			} else {
				const result = await authClient.signIn.email({
					email,
					password,
					callbackURL: "/",
				});

				if (result?.data?.user) {
					onAuthSuccess(result.data.user);
					console.log("Sign in successful");
				}
			}
		} catch (error: unknown) {
			console.error("Failed to authenticate:", error);
			setError(
				error instanceof Error
					? error.message
					: isSignUp
						? "Failed to sign up. Please try again."
						: "Invalid credentials. Please try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	const otpNameId = useId();
	const otpEmailId = useId();
	const magicNameId = useId();
	const magicEmailId = useId();
	const passwordNameId = useId();
	const passwordEmailId = useId();
	const passwordPasswordId = useId();

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
					<CardDescription>
						Choose your preferred sign-in method
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="password" className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="password">Password</TabsTrigger>
							<TabsTrigger value="otp">
								<KeyRound className="mr-2 h-4 w-4" />
								OTP
							</TabsTrigger>
							<TabsTrigger value="magic-link">
								<Mail className="mr-2 h-4 w-4" />
								Magic Link
							</TabsTrigger>
						</TabsList>

						<TabsContent value="password" className="space-y-4">
							<form onSubmit={handleEmailPasswordAuth} className="space-y-4">
								{isSignUp && (
									<div className="space-y-2">
										<Label htmlFor={passwordNameId}>Name</Label>
										<Input
											id={passwordNameId}
											type="text"
											placeholder="Your name"
											value={name}
											onChange={(e) => setName(e.target.value)}
											required
										/>
									</div>
								)}
								<div className="space-y-2">
									<Label htmlFor={passwordEmailId}>Email</Label>
									<Input
										id={passwordEmailId}
										type="email"
										placeholder="you@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor={passwordPasswordId}>Password</Label>
									<Input
										id={passwordPasswordId}
										type="password"
										placeholder="••••••••"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										minLength={8}
									/>
								</div>
								{error && <p className="text-sm text-destructive">{error}</p>}
								<Button type="submit" className="w-full" disabled={loading}>
									{loading
										? isSignUp
											? "Creating account..."
											: "Signing in..."
										: isSignUp
											? "Sign Up"
											: "Sign In"}
								</Button>
								<Button
									type="button"
									variant="ghost"
									className="w-full"
									onClick={() => {
										setIsSignUp(!isSignUp);
										setError("");
										setPassword("");
									}}
								>
									{isSignUp
										? "Already have an account? Sign in"
										: "Need an account? Sign up"}
								</Button>
							</form>
						</TabsContent>

						<TabsContent value="otp" className="space-y-4">
							{!otpSent ? (
								<form onSubmit={handleSendOTP} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="otp-name">Name</Label>
										<Input
											id={otpNameId}
											type="text"
											placeholder="Your name"
											value={name}
											onChange={(e) => setName(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="otp-email">Email</Label>
										<Input
											id={otpEmailId}
											type="email"
											placeholder="you@example.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>
									{error && <p className="text-sm text-destructive">{error}</p>}
									<Button type="submit" className="w-full" disabled={loading}>
										{loading ? "Sending..." : "Send OTP"}
									</Button>
								</form>
							) : (
								<form onSubmit={handleVerifyOTP} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="otp-code">Enter OTP</Label>
										<div className="flex justify-center">
											<InputOTP
												maxLength={6}
												value={otp}
												onChange={(value) => setOtp(value)}
											>
												<InputOTPGroup>
													<InputOTPSlot index={0} />
													<InputOTPSlot index={1} />
													<InputOTPSlot index={2} />
													<InputOTPSlot index={3} />
													<InputOTPSlot index={4} />
													<InputOTPSlot index={5} />
												</InputOTPGroup>
											</InputOTP>
										</div>
										<p className="text-sm text-muted-foreground text-center">
											Code sent to {email}
										</p>
										<div className="mt-3 rounded-lg bg-muted p-3 text-center">
											<p className="text-xs text-muted-foreground">
												Check the server console for your OTP code
											</p>
										</div>
									</div>
									{error && (
										<p className="text-sm text-destructive text-center">
											{error}
										</p>
									)}
									<Button
										type="submit"
										className="w-full"
										disabled={loading || otp.length !== 6}
									>
										{loading ? "Verifying..." : "Verify OTP"}
									</Button>
									<Button
										type="button"
										variant="ghost"
										className="w-full"
										onClick={() => {
											setOtpSent(false);
											setOtp("");
											setError("");
										}}
									>
										Use different email
									</Button>
								</form>
							)}
						</TabsContent>

						<TabsContent value="magic-link" className="space-y-4">
							{!magicLinkSent ? (
								<form onSubmit={handleSendMagicLink} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="magic-name">Name</Label>
										<Input
											id={magicNameId}
											placeholder="Your name"
											value={name}
											onChange={(e) => setName(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="magic-email">Email</Label>
										<Input
											id={magicEmailId}
											placeholder="you@example.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>
									{error && <p className="text-sm text-destructive">{error}</p>}
									<Button type="submit" className="w-full" disabled={loading}>
										{loading ? "Sending..." : "Send Magic Link"}
									</Button>
								</form>
							) : (
								<div className="space-y-4 text-center">
									<div className="rounded-lg bg-muted p-4">
										<Mail className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
										<p className="font-medium">Check your email</p>
										<p className="text-sm text-muted-foreground mt-1">
											We sent a magic link to {email}
										</p>
										<p className="text-xs text-muted-foreground mt-2">
											Check browser console for magic link
										</p>
									</div>
									<Button
										type="button"
										variant="outline"
										className="w-full bg-transparent"
										onClick={() => {
											setMagicLinkSent(false);
											setEmail("");
											setError("");
										}}
									>
										Use different email
									</Button>
								</div>
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
