import { useAccount, useConnect, useDisconnect } from "wagmi";

function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-lg">✓</span>
            </div>
            <div>
              <div className="font-semibold text-green-800">Wallet Connected</div>
              <div className="text-sm text-green-600 font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
            </div>
          </div>
        </div>
        <button
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-3 rounded-xl transition-all duration-200 border border-gray-200"
          onClick={() => disconnect()}
        >
          Disconnect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-3">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-6 py-4 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          onClick={() => connect({ connector })}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Connecting...
            </>
          ) : (
            <>
              <span className="text-lg">🔗</span>
              Connect {connector.name}
            </>
          )}
        </button>
      ))}
    </div>
  );
}

export default ConnectWallet;