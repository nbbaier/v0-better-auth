"use client";

import { LoginForm } from "./components/login-form";
import { UserDashboard } from "./components/user-dashboard";
import { authClient } from "./lib/auth-client";

function App() {
	const { data: session, isPending } = authClient.useSession();

	const handleAuthSuccess = () => {
		window.location.reload();
	};

	const handleLogout = async () => {
		await authClient.signOut();
	};

	if (isPending) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-muted-foreground">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{!session?.user ? (
				<LoginForm onAuthSuccess={handleAuthSuccess} />
			) : (
				<UserDashboard user={session.user} onLogout={handleLogout} />
			)}
		</div>
	);
}

export default App;
