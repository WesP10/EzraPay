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
      <div className="p-4">
        <Card className="rounded-xl shadow-md p-4">
          <h2 className="text-lg font-bold text-gray-700 mb-2">Wallet Information</h2>
          <p className="text-sm text-gray-600">
            <strong>Public Key:</strong> {wallet.publicKey}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <p className="text-gray-700 text-center">
        No wallet connected. Please connect an existing wallet or create a new one.
      </p>
      <ConnectWallet/>
      <Button
        className="bg-gray-700 text-white font-semibold px-4 py-2 rounded-md"
        onClick={onCreateWallet}
      >
        Create Wallet
      </Button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}