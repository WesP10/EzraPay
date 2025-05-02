# BRBToken Project

This project contains the `BRBToken` ERC20-compatible smart contract, deployment scripts, and tests. It is built using Hardhat and integrates with the EzraPay ecosystem.

## Project Structure

```
brb-token/
├── artifacts/               # Compiled contract artifacts
├── cache/                   # Hardhat cache
├── contracts/               # Solidity contracts
│   ├── BRBToken.sol         # BRBToken contract
│   └── Lock.sol             # Example contract
├── ignition/                # Hardhat Ignition modules
│   └── modules/
│       └── Lock.ts          # Example deployment module
├── scripts/                 # Deployment scripts
│   └── deploy.ts            # Deployment script for BRBToken
├── test/                    # Hardhat tests
│   └── Lock.ts              # Example test for Lock contract
├── typechain-types/         # TypeScript typings for contracts
├── hardhat.config.ts        # Hardhat configuration
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## Prerequisites

- **Node.js**: Install Node.js (v16 or later).
- **Hardhat**: Install Hardhat globally or use it locally in the project.
- **Ethereum Wallet**: Ensure you have a wallet with testnet funds (e.g., Goerli ETH).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/ezrapay.git
   cd brb-token
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the `brb-token` directory with the following variables:
   ```env
   PRIVATE_KEY=your_wallet_private_key
   RPC_URL=https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID
   ```

2. Replace `your_wallet_private_key` with your Ethereum wallet's private key and `YOUR_INFURA_PROJECT_ID` with your Infura project ID.

## Usage

### Compile Contracts

Compile the Solidity contracts using Hardhat:
```bash
npx hardhat compile
```

### Deploy Contracts

Deploy the `BRBToken` contract to a network (e.g., Goerli):
```bash
npx hardhat run scripts/deploy.ts --network goerli
```

### Run Tests

Run the tests for the contracts:
```bash
npx hardhat test
```

### Interact with the Contract

Use the Hardhat console to interact with the deployed contract:
```bash
npx hardhat console --network goerli
```

Example interaction:
```javascript
const BRBToken = await ethers.getContractAt("BRBToken", "0xYourDeployedContractAddress");
await BRBToken.mint("0xRecipientAddress", ethers.utils.parseUnits("100", 18));
```

## Scripts

- **`scripts/deploy.ts`**: Deploys the `BRBToken` contract to the specified network.

## Tests

- **`test/Lock.ts`**: Example test for the `Lock` contract. Add tests for `BRBToken` in this directory.

## Dependencies

- [Hardhat](https://hardhat.org/)
- [Ethers.js](https://docs.ethers.io/)
- [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)

## License

This project is licensed under the MIT License.