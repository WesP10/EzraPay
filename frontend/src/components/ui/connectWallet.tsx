import { useAccount, useConnect, useDisconnect } from "wagmi";

function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const buttonStyle = {
    backgroundColor: "#b31b1b", // Red background
    color: "#f3f3f3", // Grey text
    borderRadius: "8px", // Rounded corners
    padding: "10px 20px", // Padding
    border: "none", // Remove border
    cursor: "pointer", // Pointer cursor
    margin: "5px", // Add spacing between buttons
  };

  if (isConnected) {
    return (
      <div>
        <div>Connected to {address}</div>
        <button style={buttonStyle} onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          style={buttonStyle}
          onClick={() => connect({ connector })}
          disabled={isPending}
        >
          {isPending ? "Connecting..." : `Connect ${connector.name}`}
        </button>
      ))}
    </div>
  );
}

export default ConnectWallet;