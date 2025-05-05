import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type React from "react";
import { useEffect, useState } from "react";
import { HomeView } from "@/components/views/home-view";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, linea, lineaSepolia } from "wagmi/chains";
import { metaMask, coinbaseWallet, safe, injected } from "wagmi/connectors";

const client = new QueryClient();

function App() {
  // Authentication state
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to restore user ID from localStorage
    const stored = localStorage.getItem("userId");
    setUserId(stored);
    setLoading(false);
  }, []);

  function handleLogin(uid: string) {
    localStorage.setItem("userId", uid);
    setUserId(uid);
  }

  function handleLogout() {
    localStorage.removeItem("userId");
    setUserId(null);
  }

  if (loading) return null;
  if (!userId) {
    // Not logged in: Show auth forms
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-100 px-2">
        <div className="w-full max-w-xs">
          <Card className="p-6 pb-4 rounded-2xl shadow-lg">
            <div className="font-bold text-center text-[#b31b1b] mb-6 text-2xl">
              Cornell University
            </div>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <AuthForm mode="login" onSuccess={handleLogin} />
              </TabsContent>
              <TabsContent value="register">
                <AuthForm mode="register" onSuccess={handleLogin} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    );
  }

  // Authenticated: Show dashboard
  const user = {
    name: "WESTON RICHARD CLARK",
    school: "Cornell University",
  };
  const accounts = [
    { name: "CB1 City Bucks", balance: "$5.01" },
    { name: "BRB Big Red Bucks Spring", balance: "$160.42" },
  ];

  // Add Phantom connector to the wagmi configuration
  const config = createConfig({
    ssr: true, // Make sure to enable this for server-side rendering (SSR) applications.
    chains: [mainnet, linea, lineaSepolia],
    connectors: [metaMask(), coinbaseWallet(), safe(), injected()], // Include Phantom connector
    transports: {
      [mainnet.id]: http(),
      [linea.id]: http(),
      [lineaSepolia.id]: http(),
    },
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <HomeView
          user={{ id: userId }}
          accounts={accounts}
          onLogout={handleLogout}
        />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

type AuthMode = "login" | "register";

function AuthForm({
  mode,
  onSuccess,
}: {
  mode: AuthMode;
  onSuccess: (uid: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (mode === "register" && password !== confirm) {
        setError("Passwords do not match");
        setPending(false);
        return;
      }
      const reqUrl = mode === "login" ? `api/login` : `api/register`;
      const payload = { email, password };

      const resp = await fetch(reqUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Unknown error");

      if (data.user) {
        onSuccess(data.user);
      } else {
        throw new Error("No user returned from API");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit}>
      <input
        type="email"
        placeholder="Email"
        className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b31b1b]"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={pending}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b31b1b]"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={pending}
        required
      />
      {mode === "register" && (
        <input
          type="password"
          placeholder="Confirm Password"
          className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b31b1b]"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={pending}
          required
        />
      )}
      {error && (
        <div className="text-xs text-red-600 text-center mt-1">{error}</div>
      )}
      <Button
        type="submit"
        className="w-full bg-[#b31b1b] text-white font-semibold py-2"
      >
        {pending
          ? mode === "login"
            ? "Logging in..."
            : "Registering..."
          : mode === "login"
          ? "Login"
          : "Register"}
      </Button>
    </form>
  );
}

export default App;
