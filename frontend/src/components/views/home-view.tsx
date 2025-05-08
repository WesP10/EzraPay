import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

  const handleTransferCrypto = async () => {
    console.log("Transfer Crypto clicked");
    // Add logic to handle crypto transfer
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      {/* HEADER CARD */}
      <div className="bg-[#b31b1b] rounded-b-2xl px-4 pt-10 pb-6 text-white">
        <div className="text-center font-semibold tracking-wide text-lg mb-2">Welcome</div>
        <div className="flex flex-col items-center">
          <Avatar className="w-16 h-16">
            {photo ? (
              <img src={`http://localhost:3000/photo/${photo}`} alt="Profile" className="rounded-full" />
            ) : (
              <AvatarFallback className="bg-gray-300 text-gray-600">?</AvatarFallback>
            )}
          </Avatar>
          <div className="text-lg font-bold uppercase mb-4 text-center tracking-wider">{name}</div>
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
      <div className="flex-1 px-4 flex flex-col gap-4 mt-4 pb-20">
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

            {/* PURCHASE BRB TOKENS AND TRANSFER CRYPTO */}
            <Card className="rounded-xl shadow-sm pb-3">
              <div className="p-4 pb-1 font-semibold text-gray-700 text-base">Actions</div>
              <div className="flex flex-col gap-3 px-4 pb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Enter BRB amount"
                    className="flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b31b1b]"
                    value={brbAmount}
                    onChange={(e) => setBrbAmount(Number(e.target.value))}
                  />
                  <Button
                    className="bg-[#b31b1b] text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-[#a10f0f]"
                    onClick={handlePurchaseBRB}
                  >
                    Purchase
                  </Button>
                </div>
                <Button
                  className="bg-[#b31b1b] text-white font-semibold py-2 rounded-md shadow-md hover:bg-[#a10f0f]"
                  onClick={handleTransferCrypto}
                >
                  Transfer Crypto
                </Button>
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