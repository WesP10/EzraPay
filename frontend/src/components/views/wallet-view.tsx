import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConnectWallet from "@/components/ui/connectWallet";

type WalletViewProps = {
  userId: string | null;
  onCreateWallet: () => Promise<void>;
  onConnectWallet: () => Promise<void>;
};

export function WalletView({ userId, onCreateWallet, onConnectWallet }: WalletViewProps) {
  const [wallet, setWallet] = useState<{ publicKey: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch wallet information if userId exists
    async function fetchWallet() {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/wallet`, {
          headers: { Authorization: userId },
        });
        const data = await response.json();
        if (data.success) {
          setWallet(data.wallet);
        } else {
          setWallet(null);
        }
      } catch (err: any) {
        console.error("Error fetching wallet:", err.message);
        setError("Failed to fetch wallet information.");
      } finally {
        setLoading(false);
      }
    }

    fetchWallet();
  }, [userId]);

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (wallet) {
    return (
      <div className="p-6">
        <Card className="rounded-2xl shadow-sm border-0 bg-white/70 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cornell-red to-cornell-dark-red rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">💳</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Connected Wallet</h2>
                <p className="text-sm text-gray-600">Your digital assets</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-2 font-medium">Public Key</p>
              <p className="text-sm font-mono bg-gray-100 p-3 rounded-lg break-all">
                {wallet.publicKey}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-cornell-red/10 to-cornell-red/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <span className="text-4xl">🚀</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Get Started with Crypto</h3>
        <p className="text-gray-600 text-center max-w-sm">
          Connect your existing wallet or create a new one to start managing your digital assets
        </p>
      </div>
      
      <div className="w-full max-w-sm space-y-4">
        <ConnectWallet/>
        <Button
          className="w-full bg-gradient-to-r from-cornell-red to-cornell-dark-red text-white font-semibold px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          onClick={onCreateWallet}
        >
          <span className="mr-2">✨</span>
          Create New Wallet
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm max-w-sm">
          {error}
        </div>
      )}
    </div>
  );
}