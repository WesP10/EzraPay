import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, Wallet, Settings } from "lucide-react";
import { WalletView } from "@/components/views/wallet-view";

type HomeViewProps = {
  user: { name: string; school: string };
  accounts: { name: string; balance: string }[];
  onLogout: () => void;
};

export function HomeView({ user, accounts, onLogout }: HomeViewProps) {
  const [activeView, setActiveView] = useState<"home" | "wallet" | "settings">("home");

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
          <Button
            className="bg-transparent border-none text-white font-semibold mt-2 underline"
            type="button"
            onClick={onLogout}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content sections */}
      <div className="flex-1 px-4 flex flex-col gap-4 mt-4">
        {activeView === "home" && (
          <>
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
          </>
        )}
        {activeView === "wallet" && (
          <WalletView
            userId={user.name}
            onCreateWallet={async () => {
              console.log("Dummy create wallet method called");
              return Promise.resolve();
            }}
            onConnectWallet={async () => {
              console.log("Dummy connect wallet method called");
              return Promise.resolve();
            }}
          />
        )}
        {activeView === "settings" && (
          <Card className="rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-bold text-gray-700">Settings</h2>
            <p className="text-sm text-gray-600">Settings content goes here.</p>
          </Card>
        )}
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-t-lg border-t flex justify-around py-2 z-10">
        <NavTab icon={<Home />} label="Home" isActive={activeView === "home"} onClick={() => setActiveView("home")} />
        <NavTab icon={<Wallet />} label="Wallet" isActive={activeView === "wallet"} onClick={() => setActiveView("wallet")} />
        <NavTab icon={<Settings />} label="Settings" isActive={activeView === "settings"} onClick={() => setActiveView("settings")} />
      </nav>
    </div>
  );
}

function NavTab({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`group flex flex-col items-center px-3 pt-1 gap-0.5 ${
        isActive ? "text-[#b31b1b]" : "text-gray-500"
      } hover:text-[#b31b1b] focus:text-[#b31b1b]`}
      onClick={onClick}
    >
      <span className="h-6 w-6">{icon}</span>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}