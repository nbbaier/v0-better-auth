"use client";

import { useEffect, useState } from "react";
import { LoginForm } from "./components/login-form";
import { UserDashboard } from "./components/user-dashboard";
import { authClient, type User } from "./lib/auth-client";
import { AuthProvider } from "./lib/auth-context";

function App() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user is already authenticated
		const checkAuth = async () => {
			try {
				const session = await authClient.getSession();
				if (session?.user) {
					setUser(session.user);
				}
			} catch (error) {
				console.error("[v0] Auth check failed:", error);
			} finally {
				setLoading(false);
			}
		};

		checkAuth();

		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get("token");

		if (token) {
			authClient
				.verifyMagicLink(token)
				.then((result) => {
					if (result?.user) {
						setUser(result.user);
						// Clean up URL
						window.history.replaceState(
							{},
							document.title,
							window.location.pathname,
						);
					}
				})
				.catch((error) => {
					console.error("[v0] Magic link verification failed:", error);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, []);

	const handleAuthSuccess = (userData: User) => {
		setUser(userData);
	};

	const handleLogout = async () => {
		await authClient.signOut();
		setUser(null);
	};

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-muted-foreground">Loading...</div>
			</div>
		);
	}

	return (
		<AuthProvider>
			<div className="min-h-screen bg-background">
				{!user ? (
					<LoginForm onAuthSuccess={handleAuthSuccess} />
				) : (
					<UserDashboard user={user} onLogout={handleLogout} />
				)}
			</div>
		</AuthProvider>
	);
}

export default App;
