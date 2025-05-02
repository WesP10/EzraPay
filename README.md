# EzraPay

A full-stack payment application with Solana integration and an ERC20-compatible token (`BRBToken`).

## Project Structure

```
ezrapay/
├── frontend/                # React frontend application
│   ├── public/              # Static files
│   ├── src/                 # Source files
│   └── package.json         # Frontend dependencies
├── src/                     # Backend source files
│   ├── routes/              # Express routes
│   │   ├── brb-token-router.ts  # BRBToken-related routes
│   │   └── firebase-router.ts   # Firebase authentication routes
│   ├── server.ts            # Main backend server file
│   └── package.json         # Backend dependencies
├── brb-token/               # Smart contract and blockchain integration
│   ├── contracts/           # Solidity contracts
│   │   ├── BRBToken.sol     # BRBToken contract
│   │   └── Lock.sol         # Example contract
│   ├── scripts/             # Deployment scripts
│   │   ├── deploy.ts        # Deployment script for BRBToken
│   ├── test/                # Hardhat tests
│   │   └── Lock.ts          # Example test for Lock contract
│   ├── hardhat.config.ts    # Hardhat configuration
│   ├── package.json         # Smart contract dependencies
│   ├── tsconfig.json        # TypeScript configuration for Hardhat
│   └── .gitignore           # Ignored files for the smart contract project
├── .env                     # Environment variables
├── package.json             # Root dependencies
├── tsconfig.json            # Root TypeScript configuration
└── README.md                # Project documentation
```

### Backend Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Create a `.env` File**:
   Add the following environment variables:
   ```
   MONGO_DB_USERNAME=your_username
   MONGO_DB_PASSWORD=your_password
   FB_API_KEY=your_firebase_api_key
   FB_AUTH_DOMAIN=your_firebase_auth_domain
   FB_PROJ_ID=your_project_id
   FB_STORAGE_BUCKET=your_storage_bucket
   FB_SENDER_ID=your_sender_id
   FB_APP_ID=your_app_id
   FB_MEASUREMENT_ID=your_measurement_id
   BRB_TOKEN_ADDRESS=your_brb_token_contract_address
   PRIVATE_KEY=your_wallet_private_key
   RPC_URL=https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID
   ```

3. **Start the Backend Server**:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to the Frontend Directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Frontend Development Server**:
   ```bash
   npm start
   ```

### Smart Contract Setup

1. **Navigate to the `brb-token` Directory**:
   ```bash
   cd brb-token
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Compile the Contracts**:
   ```bash
   npx hardhat compile
   ```

4. **Deploy the Contracts**:
   Update the `deploy.ts` script with your deployment details, then run:
   ```bash
   npx hardhat run scripts/deploy.ts --network goerli
   ```

5. **Run Tests**:
   ```bash
   npx hardhat test
   ```

### API Endpoints

#### Authentication
- **POST `/api/auth/register`** - Register a new user
- **POST `/api/auth/login`** - Login user
- **POST `/api/auth/logout`** - Logout user

#### Wallet
- **POST `/api/mongodb/wallet`** - Create a new wallet

#### BRBToken
- **POST `/api/brb-token/mint`** - Mint BRB tokens to a recipient
  - **Request Body**:
    ```json
    {
      "recipient": "0xRecipientAddress",
      "amount": 100
    }
    ```

#### Conversion
- **POST `/api/mongodb/convert`** - Convert crypto to BRB

### Technologies Used

- **Backend**: Node.js, Express, TypeScript, MongoDB, Firebase
- **Frontend**: React, TypeScript
- **Blockchain**: Solidity, Hardhat, ethers.js
- **Smart Contracts**: ERC20-compatible `BRBToken`

### Future Enhancements

- Add more tests for smart contracts.
- Integrate Solana wallet functionality in the frontend.
- Implement advanced tokenomics for `BRBToken`.

---

Let me know if you need further assistance!
