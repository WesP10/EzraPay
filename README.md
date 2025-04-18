# Cornell OnChain Backend

A backend Node.js project designed to enable seamless crypto-to-BRB conversions for the Cornell campus economy. The backend supports wallet creation, authentication, and transaction handling with robust scalability and security features.

## Features
- Wallet creation endpoint
- Crypto-to-BRB conversion endpoint
- Integration with MongoDB for database management
- Firebase for secure authentication

## Tech Stack
- **Node.js**: Backend framework
- **TypeScript**: Strongly-typed JavaScript for maintainable code
- **MongoDB**: NoSQL database for storing user and transaction data
- **Firebase**: Authentication for secure user management
- **Express.js**: RESTful API framework for efficient endpoint management

## Installation

1. Clone the repository:
  ```bash```
  ```git clone https://github.com/your-repo/cornell-onchain-backend.git```
  ```cd cornell-onchain-backend```
2. Install dependencies:npm install
  ```npm install```
3. Configure environment variables: Create a .env file in the root directory and include:
  ```MONGO_URI=mongodb://localhost:27017/yourDB```
  ```FIREBASE_CREDENTIALS=path_to_your_firebase_service_account.json```
4. Start the development server:
  ```npm run dev```


## Endpoints
1. Wallet Creation
- Method: POST
- Endpoint: /wallet
- Description: Creates a new wallet for the user.
- Status: Logic not implemented yet.

2. Crypto-to-BRB Conversion
- Method: POST
- Endpoint: /convert
- Description: Converts cryptocurrency into BRBs based on the current exchange rate.
- Status: Logic not implemented yet.

## Project Structure
├── src \\
│   ├── server.ts    # Endpoint logic <br />
│   ├── models         # MongoDB schemas  <br />
│   ├── routes         # API routes  <br />
│   └── utils          # Utility functions  <br />
├── .env               # Environment configuration  <br \>
├── package.json       # Project metadata and dependencies  <br \>
└── tsconfig.json      # TypeScript configuration  <br \>


## Future Enhancements
- Implement wallet creation logic.
- Add crypto-to-BRB conversion functionality.
- Enhance security with encryption for sensitive data.
- Integrate Solana or Ethereum blockchain for seamless transactions.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.
License

This project is licensed under the MIT License.
