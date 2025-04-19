import express, { Request, Response, NextFunction } from "express";
import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import dotenv from "dotenv";
import * as solanaWeb3 from "@solana/web3.js";

// console.log(solanaWeb3);
dotenv.config();
const app = express();
app.use(express.json());

// Firebase configuration for client SDK
const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJ_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_SENDER_ID,
  appId: process.env.FB_APP_ID,
  measurementId: process.env.FB_MEASUREMENT_ID,
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth();

// Password validation function
function validatePassword(password: string) {
  const requirements = {
    hasLowerCase: /[a-z]/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasMinLength: password.length >= 8
  };

  const isValid = Object.values(requirements).every(Boolean);
  return { isValid, requirements };
}

// Define endpoints
app.post("/register", ((req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  
  // Validate password
  const { isValid, requirements } = validatePassword(password);
  if (!isValid) {
    return res.status(400).json({ 
      error: "Password does not meet requirements",
      requirements 
    });
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      res.json({ success: true, user: user.uid });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
}) as express.RequestHandler);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    res.json({ success: true, user: user.uid });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/logout", ((req: Request, res: Response, next: NextFunction) => {
  signOut(auth)
    .then(() => {
      res.json({ success: true, message: "Signed out successfully" });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
}) as express.RequestHandler);

// MongoDB connection
const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@ezrapay.flwga3p.mongodb.net/?retryWrites=true&w=majority&appName=ezrapay`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db: Db | null = null;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("ezrapay");
    console.log("Connected to MongoDB!");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return null;
  }
}

// Initialize database connection
connectDB().then(connectedDb => {
  if (connectedDb) {
    db = connectedDb;
  }
}).catch(console.error);

// Define endpoints
app.post("/wallet", async (req, res) => {
  const { Keypair } = require("@solana/web3.js");
  
  try {
    // Check if user is authenticated
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        error: "Authentication required" 
      });
    }

    if (!db) {
      return res.status(500).json({ 
        success: false, 
        error: "Database not connected" 
      });
    }

    // Generate new Solana wallet keypair
    const wallet = Keypair.generate();

    // Extract public and private keys
    const publicKey = wallet.publicKey.toString();
    const privateKey = Buffer.from(wallet.secretKey).toString('hex');

    // Create wallet document
    const walletDoc = {
      userId: authHeader,
      publicKey: publicKey,
      privateKey: privateKey,
      createdAt: new Date()
    };

    // Store wallet in MongoDB
    const walletsCollection = db.collection("wallets");
    await walletsCollection.insertOne(walletDoc);

    // Return only public key to client
    res.status(200).json({ 
      success: true,
      wallet: {
        publicKey: publicKey
      }
    });

  } catch (error: any) {
    console.error("Wallet creation error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// TODO: Add logic to handle crypto-to-BRB conversion
app.post("/convert", (req, res) => {
  // Conversion logic here
  res.send("Crypto-to-BRB conversion endpoint - Logic not implemented yet");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Backend Todos:
// [x] Create Node.js project (Done by initializing above)
// [x] Add endpoint for wallet creation (Logic needs implementation)
// [ ] Add endpoint for crypto to BRB (Logic needs implementation)
// [x] Connect MongoDB (Connected, ready for database schema)
// [x] Add Firebase authentication (Initialized, ready for use)