import express, { Request, Response, NextFunction } from "express";
import { MongoClient, ServerApiVersion } from 'mongodb';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
// Initialize Express app
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

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@ezrapay.flwga3p.mongodb.net/?retryWrites=true&w=majority&appName=ezrapay`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

connectDB().catch(console.dir);

async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}

// Define endpoints
// TODO: Add logic to create a wallet
app.post("/wallet", (req, res) => {
  // Wallet creation logic here
  res.send("Wallet creation endpoint - Logic not implemented yet");
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
// [ ] Add endpoint for wallet creation (Logic needs implementation)
// [ ] Add endpoint for crypto to BRB (Logic needs implementation)
// [x] Connect MongoDB (Connected, ready for database schema)
// [x] Add Firebase authentication (Initialized, ready for use)