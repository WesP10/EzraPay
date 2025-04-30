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
  const [photo, setPhoto] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [netId, setNetId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user info from the backend
    async function fetchUserInfo() {
      try {
        if (!user.id) {
          throw new Error("User ID is missing. Redirecting to login...");
        }

        const response = await fetch(`/userinfo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            userId: user.id, // Send userId in the Authorization header
          },
        });

        console.log("Response from userinfo endpoint:", response); // Log the response object
        const data = await response.json();
        if (data.success) {
          console.log("User info fetched successfully:", data);

          // Update state with fetched data
          setName(data.name || "");
          setEmail(data.email || "");
          setNetId(data.netId || "");
          if (data.photo) {
            setPhoto(data.photo); // Assuming `photo` is a file or URL
          }
        } else {
          console.error("Failed to fetch user info:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        onLogout(); // Log the user out if fetching user info fails
      } finally {
        setLoading(false);
      }
    }

    fetchUserInfo();
  }, [user.id, onLogout]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      {/* HEADER CARD */}
      <div className="bg-[#b31b1b] rounded-b-2xl px-4 pt-10 pb-6 text-white">
        <div className="text-center font-semibold tracking-wide text-lg mb-2">Welcome</div>
        <div className="flex flex-col items-center">
          <Avatar className="w-20 h-20 border-4 border-white mb-2 shadow-lg">
            {photo ? (
              <img src={URL.createObjectURL(photo)} alt="Profile" className="rounded-full" />
            ) : (
              <AvatarFallback className="text-3xl bg-[#861313]">?</AvatarFallback>
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
            user={{ name, email, netId }}
            onUpdate={async (updatedUser) => {
              console.log("Updated user details:", updatedUser);

              try {
                const response = await fetch("/update-user", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    userId: user.id, // Include user ID in the request
                    name: updatedUser.name,
                    email: updatedUser.email,
                    school: "Cornell University", // Replace with actual school if needed
                    netId: updatedUser.netId,
                    photo: updatedUser.photo || null, // Optional photo field
                  }),
                });

                const data = await response.json();
                if (data.success) {
                  console.log("User information updated successfully:", data.message);
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