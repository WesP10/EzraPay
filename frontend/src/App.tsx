import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Home, Wallet, Settings } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

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
            <div className="font-bold text-center text-[#b31b1b] mb-6 text-2xl">Cornell University</div>
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
  // Hardcoded sample user/account info for demo purposes
  const user = {
    name: "WESTON RICHARD CLARK",
    school: "Cornell University",
  };
  const accounts = [
    { name: "CB1 City Bucks", balance: "$5.01" },
    { name: "BRB Big Red Bucks Spring", balance: "$160.42" },
  ];
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      {/* HEADER CARD */}
      <div className="bg-[#b31b1b] rounded-b-2xl px-4 pt-10 pb-6 text-white">
        <div className="text-center font-semibold tracking-wide text-lg mb-2">
          {user.school}
        </div>
        <div className="flex flex-col items-center">
          <Avatar className="w-20 h-20 border-4 border-white mb-2 shadow-lg">
            <AvatarFallback className="text-3xl bg-[#861313]">WC</AvatarFallback>
          </Avatar>
          <div className="text-lg font-bold uppercase mb-4 text-center tracking-wider">
            {user.name}
          </div>
          <Button className="bg-white text-[#b31b1b] w-full font-semibold max-w-xs shadow-md hover:bg-gray-100 aria-pressed:bg-gray-200">
            View Wallet
          </Button>
          <Button className="bg-transparent border-none text-white font-semibold mt-2 underline" type="button" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </div>
      {/* Main content sections */}
      <div className="flex-1 px-4 flex flex-col gap-4 mt-4">
        {/* ACCOUNTS CARD */}
        <Card className="rounded-xl shadow-sm pb-3">
          <div className="p-4 pb-1 font-semibold text-gray-700 text-base">Accounts</div>
          <div className="flex items-center gap-2 px-4 pb-2">
            {accounts.map((acct) => (
              <div
                key={acct.name}
                className="flex-1 bg-gray-100 rounded-lg p-3 text-center text-sm font-medium text-gray-900"
              >
                <div className="text-xs text-gray-500 mb-1 leading-tight">{acct.name}</div>
                <div className="text-lg font-bold">{acct.balance}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center pt-1">
            <button className="text-[#b31b1b] text-sm font-semibold hover:underline">ADD FUNDS</button>
          </div>
        </Card>
        {/* TRANSACTIONS CARD */}
        <Card className="rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 pb-2">
            <div className="font-semibold text-gray-700 text-base">Transactions</div>
            <button className="text-[#b31b1b] text-sm font-semibold hover:underline">ALL TRANSACTIONS</button>
          </div>
        </Card>
        <div className="flex-1" />
      </div>
      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-t-lg border-t flex justify-around py-2 z-10">
        <NavTab icon={<Home />} label="Home" />
        <NavTab icon={<Wallet />} label="Wallet" />
        <NavTab icon={<Settings />} label="Settings" />
      </nav>
    </div>
  );
}

type AuthMode = "login" | "register";

function AuthForm({ mode, onSuccess }: { mode: AuthMode; onSuccess: (uid: string) => void }) {
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
      const reqUrl = `http://localhost:3000/${mode === "login" ? "login" : "register"}`;
      const payload = { email, password };
      let resp;
      try {
        resp = await fetch(reqUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (fetchErr) {
        // Log details for debugging network issues
        console.error(
          `[AuthForm] Failed to fetch API:`,
          `URL: ${reqUrl}`,
          `Payload:`,
          payload,
          `Error:`,
          fetchErr
        );
        setError(
          "Network error: Could not reach the server. Please check you are connected and the backend is running." + fetchErr
        );
        setPending(false);
        return;
      }
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
        onChange={e => setEmail(e.target.value)}
        disabled={pending}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b31b1b]"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        value={password}
        onChange={e => setPassword(e.target.value)}
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
          onChange={e => setConfirm(e.target.value)}
          disabled={pending}
          required
        />
      )}
      {error && <div className="text-xs text-red-600 text-center mt-1">{error}</div>}
      <Button type="submit" className="w-full bg-[#b31b1b] text-white font-semibold py-2">
        {pending ? (mode === "login" ? "Logging in..." : "Registering...") : mode === "login" ? "Login" : "Register"}
      </Button>
    </form>
  );
}

function NavTab({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="group flex flex-col items-center px-3 pt-1 gap-0.5 text-gray-500 hover:text-[#b31b1b] focus:text-[#b31b1b]">
      <span className="h-6 w-6">{icon}</span>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

export default App;
