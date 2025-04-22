# EzraPay

A full-stack payment application with Solana integration.

## Project Structure

```
ezrapay/
├── frontend/           # React frontend application
│   ├── public/        # Static files
│   ├── src/           # Source files
│   └── package.json   # Frontend dependencies
├── src/               # Backend source files
├── package.json       # Backend dependencies
├── tsconfig.json      # TypeScript configuration
└── .env              # Environment variables
```

## Setup

### Backend Setup
1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your environment variables:
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
```

3. Start the backend server:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/register` - Register a new user
- POST `/login` - Login user
- POST `/logout` - Logout user

### Wallet
- POST `/wallet` - Create a new wallet

### Conversion
- POST `/convert` - Convert crypto to BRB

## Technologies Used
- Backend: Node.js, Express, TypeScript, MongoDB, Firebase
- Frontend: React, TypeScript
- Blockchain: Solana
