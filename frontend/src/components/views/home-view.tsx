import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Header } from "@/components/ui/header";
import { SettingsView } from "@/components/views/settings";
import { Home, Wallet, Settings } from "lucide-react";
import { WalletView } from "@/components/views/wallet-view";

type HomeViewProps = {
  user: { id: string }; // Only `id` is required from the backend
  accounts: { name: string; balance: string }[];
  onLogout: () => void;
};

export function HomeView({ user, accounts, onLogout }: HomeViewProps) {
  const [activeView, setActiveView] = useState<"home" | "wallet" | "settings">("home");

  // State for user data
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [netId, setNetId] = useState("");
  const [loading, setLoading] = useState(true);

  // State for purchasing BRB tokens
  const [brbAmount, setBrbAmount] = useState<number>(0);

  // State for converting BRB tokens
  const [convertAmount, setConvertAmount] = useState<number>(0);

  function onWalletClick() {
    setActiveView("wallet");
  }

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        if (!user.id) {
          throw new Error("User ID is missing. Redirecting to login...");
        }

        const response = await fetch(`http://localhost:3000/userinfo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
          },
        });

        const data = await response.json();
        if (data.success) {
          setName(data.name || "");
          setEmail(data.email || "");
          setNetId(data.netId || "");
          if (data.photo) {
            setPhoto(data.photo);
          }
        } else {
          console.error("Failed to fetch user info:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        onLogout();
      } finally {
        setLoading(false);
      }
    }

    fetchUserInfo();
  }, [user.id, onLogout]);

  const handlePurchaseBRB = async () => {
    if (brbAmount <= 0) {
      alert("Please enter a valid number of BRB tokens to purchase.");
      return;
    }

    try {
      console.log(`Purchasing ${brbAmount} BRB Tokens...`);
      // Add logic to handle BRB token purchase
      const response = await fetch("http://localhost:3000/purchase-brb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ amount: brbAmount }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Successfully purchased ${brbAmount} BRB Tokens!`);
        setBrbAmount(0); // Reset the input field
      } else {
        console.error("Failed to purchase BRB tokens:", data.error);
        alert("Failed to purchase BRB tokens. Please try again.");
      }
    } catch (error) {
      console.error("Error purchasing BRB tokens:", error);
      alert("An error occurred while purchasing BRB tokens. Please try again.");
    }
  };

  const handleViewBRBToken = async () => {
    console.log("View BRB Token clicked");
    // Add logic to handle viewing BRB token
    alert("View BRB token functionality not implemented yet");
  };

  const handleConvertBRB = async () => {
    if (convertAmount <= 0) {
      alert("Please enter a valid number of BRB tokens to convert.");
      return;
    }

    try {
      console.log(`Converting ${convertAmount} BRB Tokens to BRBs...`);
      // Add logic to handle BRB token conversion
      alert("BRB token conversion functionality not implemented yet");
      setConvertAmount(0); // Reset the input field
    } catch (error) {
      console.error("Error converting BRB tokens:", error);
      alert("An error occurred while converting BRB tokens. Please try again.");
    }
  };

  const handleSendCrypto = async () => {
    console.log("Send Crypto clicked");
    // Add logic to handle sending crypto
    alert("Send crypto functionality not implemented yet");
  };

  const handleReceiveCrypto = async () => {
    console.log("Receive Crypto clicked");
    // Add logic to handle receiving crypto
    alert("Receive crypto functionality not implemented yet");
  };

  const handleSwapCrypto = async () => {
    console.log("Swap Crypto clicked");
    // Add logic to handle swapping crypto
    alert("Swap crypto functionality not implemented yet");
  };

  const handlePlaceBet = async () => {
    console.log("Place Bet clicked");
    // Add logic to handle placing bets
    alert("Place bet functionality not implemented yet");
  };

  const handleViewBets = async () => {
    console.log("View Bets clicked");
    // Add logic to handle viewing bets
    alert("View bets functionality not implemented yet");
  };

  const handleBrowseEvents = async () => {
    console.log("Browse Events clicked");
    // Add logic to handle browsing events
    alert("Browse events functionality not implemented yet");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen flex flex-col">
      <Header name={name} photo={photo} onLogout={onLogout} onWalletClick={onWalletClick} />

      {/* Main content sections */}
      <div className="flex-1 px-6 flex flex-col gap-6 mt-6 pb-24">
        {activeView === "home" && (
          <>
            {/* ACCOUNTS CARD */}
            <Card className="rounded-2xl shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800 text-lg">Your Accounts</h3>
                  <Button
                    className="bg-cornell-red text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-cornell-dark-red transition-all duration-200 text-sm"
                    onClick={() => alert("Update all accounts functionality not implemented yet")}
                  >
                    Update All
                  </Button>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}
                  </div>
                  <div className="text-sm text-gray-400">Last updated: Just now</div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {accounts.map((acct, index) => (
                  <div
                    key={acct.name}
                    className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-600 font-medium mb-1">{acct.name}</div>
                      <div className="text-2xl font-bold text-gray-900">{acct.balance}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-cornell-red/10 rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-cornell-red" />
                      </div>
                      <a
                      href={(acct as any).link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center hover:bg-blue-500/20 transition-colors"
                      >
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      </a>
                    </div>
                    </div>
                  </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* QUICK ACTIONS */}
            <Card className="rounded-2xl shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">Quick Actions</h3>
                  <div className="w-8 h-8 bg-cornell-red/10 rounded-full flex items-center justify-center">
                    <span className="text-cornell-red text-lg">⚡</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* BRB Tokens Section */}
                  <div className="bg-gradient-to-r from-cornell-red/5 to-cornell-red/10 rounded-xl p-4 border border-cornell-red/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-cornell-red rounded-lg flex items-center justify-center text-white font-bold">
                        🍔
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">BRB Tokens</div>
                        <div className="text-sm text-gray-600">Big Red Bucks • Campus dining</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Amount ($)"
                          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cornell-red/50 focus:border-cornell-red transition-all duration-200"
                          value={brbAmount}
                          onChange={(e) => setBrbAmount(Number(e.target.value))}
                        />
                        <Button
                          className="w-48 bg-cornell-red text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-cornell-dark-red transition-all duration-200 text-sm"
                          onClick={handlePurchaseBRB}
                        >
                          Add Funds
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Tokens to convert"
                          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cornell-red/50 focus:border-cornell-red transition-all duration-200"
                          value={convertAmount}
                          onChange={(e) => setConvertAmount(Number(e.target.value))}
                        />
                        <Button
                          className="w-48 bg-cornell-red text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-cornell-dark-red transition-all duration-200 text-sm"
                          onClick={handleConvertBRB}
                        >
                          Convert
                        </Button>
                      </div>
                      <Button
                        className="w-full cornell-red text-white font-semibold py-2 rounded-lg shadow-md hover:bg-cornell-dark-red transition-all duration-200 text-sm"
                        onClick={handleViewBRBToken}
                      >
                        View BRB Token
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      💡 Perfect for campus dining
                    </div>
                  </div>

                  {/* Crypto Wallet Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        ₿
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Crypto Wallet</div>
                        <div className="text-sm text-gray-600">Digital assets & DeFi</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200 text-sm"
                        onClick={handleSendCrypto}
                      >
                        Send
                      </Button>
                      <Button
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200 text-sm"
                        onClick={handleReceiveCrypto}
                      >
                        Receive
                      </Button>
                      <Button
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200 text-sm"
                        onClick={handleSwapCrypto}
                      >
                        Swap
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      💎 Manage Your Money
                    </div>
                  </div>

                  {/* Cornell Bet Section */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                        🎯
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Cornell Bet</div>
                        <div className="text-sm text-gray-600">Campus prediction markets</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-green-600 transition-all duration-200 text-sm"
                        onClick={handlePlaceBet}
                      >
                        Place Bet
                      </Button>
                      <Button
                        className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-green-600 transition-all duration-200 text-sm"
                        onClick={handleViewBets}
                      >
                        View Bets
                      </Button>
                      <Button
                        className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-green-600 transition-all duration-200 text-sm"
                        onClick={handleBrowseEvents}
                      >
                        Browse Events
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      🎰 Betting on Cornell
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
        {activeView === "wallet" && (
          <WalletView
            userId={user.id}
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
          <SettingsView
            user={{ id: user.id, name, email, netId }}
            onUpdate={async (updatedUser) => {
              console.log("Updated user details:", updatedUser);

              try {
                const response = await fetch("http://localhost:3000/update-user", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user.id,
                  },
                  body: JSON.stringify({
                    name: updatedUser.name,
                    email: updatedUser.email,
                    school: "Cornell University",
                    netId: updatedUser.netId,
                    photo: updatedUser.photo || null,
                  }),
                });

                const data = await response.json();
                if (data.success) {
                  setName(updatedUser.name);
                  setEmail(updatedUser.email);
                  setNetId(updatedUser.netId || "");
                  if (updatedUser.photo) {
                    setPhoto(updatedUser.photo);
                  }
                } else {
                  console.error("Failed to update user information:", data.error);
                }
              } catch (error) {
                console.error("Error updating user information:", error);
              }
            }}
          />
        )}
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-2xl border-t border-gray-200/50 flex justify-around py-3 z-10">
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
      className={`group flex flex-col items-center px-4 py-2 gap-1 rounded-xl transition-all duration-200 ${
        isActive 
          ? "text-cornell-red bg-cornell-red/10" 
          : "text-gray-500 hover:text-cornell-red hover:bg-cornell-red/5"
      }`}
      onClick={onClick}
    >
      <span className={`h-6 w-6 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
        {icon}
      </span>
      <span className="text-xs font-semibold">{label}</span>
      {isActive && <div className="w-4 h-0.5 bg-cornell-red rounded-full mt-0.5"></div>}
    </button>
  );
}