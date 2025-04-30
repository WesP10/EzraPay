import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import dotenv from "dotenv";
import * as solanaWeb3 from "@solana/web3.js";
import { getAuth as getAdminAuth } from "firebase-admin/auth"; // Use Firebase Admin SDK for token verification


// console.log(solanaWeb3);
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Firebase configuration for client SDK
const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJ_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_SENDER_ID,
  appId: process.env.FB_APP_ID,
  measurementId: process.env.FB_MEASUREMENT_ID
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth();

// Password validation function
function validatePassword(password: string | undefined | null) {
  if (!password) {
    return { 
      isValid: false, 
      requirements: {
        hasLowerCase: false,
        hasUpperCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        hasMinLength: false
      }
    };
  }

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
app.post("/register", async (req: Request, res: Response) => {
  const { email, password, name, school } = req.body;

  try {
    // Validate password
    const { isValid, requirements } = validatePassword(password);
    if (!isValid) {
      return res.status(400).json({
        error: "Password does not meet requirements",
        requirements,
        passwordDefined: !!password,
      });
    }

    // Register the user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Insert user information into MongoDB
    if (db) {
      const usersCollection = db.collection("users"); // Replace with your collection name
      const userInfo = {
        userId,
        name,
        email,
        school,
        netId: "", // Default value for NetID
        photo: null, // Default value for photo
      };

      await usersCollection.insertOne(userInfo);
      console.log("User info added to MongoDB:", userInfo);
    }

    res.status(201).json({ success: true, userId });
  } catch (error: any) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/login", async (req, res) => {
  console.log("Login request received:", req.body); // Log the request body
  const { email, password } = req.body;

  try {
    // Authenticate the user with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userId = user.uid;

    if (!db) {
      return res.status(500).json({ success: false, error: "Database not connected" });
    }

    // Check if the user exists in the MongoDB database
    const usersCollection = db.collection("users");
    const existingUser = await usersCollection.findOne({ userId });

    if (!existingUser) {
      // If the user does not exist, add them to the database
      const userInfo = {
        userId,
        name: user.displayName || "Unknown", // Use Firebase displayName or a default value
        email: user.email,
        school: "Cornell", // Default value for school
        netId: "", // Default value for NetID
        photo: null, // Default value for photo
      };

      await usersCollection.insertOne(userInfo);
      console.log("New user added to MongoDB:", userInfo);
    } else {
      console.log("User already exists in MongoDB:", existingUser);
    }

    // Return success response
    res.json({ success: true, user: userId });
  } catch (error: any) {
    console.error("Login error:", error.message); // Log the error
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

app.post("/userinfo", async (req: Request, res: Response) => {
  const userId = req.headers.userId as string;
  console.log("Userinfo request received:", userId); // Log the userId

  try {
    if (!db) {
      return res.status(500).json({ success: false, error: "Database not connected" });
    }

    // Query the MongoDB collection for the user
    const usersCollection = db.collection("users");
    const userInfo = await usersCollection.findOne({ userId });

    // If no user is found, return an error
    if (!userInfo) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Return the user information
    res.status(200).json({
      success: true,
      name: userInfo.name,
      email: userInfo.email,
      school: userInfo.school,
      netId: userInfo.netId,
      photo: userInfo.photo,
    });
  } catch (error: any) {
    console.error("Error fetching user info:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/update-user", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  try {
    console.log("Update-user endpoint accessed");

    if (!authHeader) {
      console.warn("Authorization header is missing");
      return res.status(401).json({ success: false, error: "Authorization header is required" });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];
    if (!token) {
      console.warn("Invalid Authorization header format");
      return res.status(401).json({ success: false, error: "Invalid Authorization header format" });
    }

    console.log("Verifying token...");
    // Verify the token using Firebase Admin SDK
    const decodedToken = await getAdminAuth().verifyIdToken(token);
    const userId = decodedToken.uid;
    console.log(`Token verified. User ID: ${userId}`);

    if (!db) {
      console.error("Database not connected");
      return res.status(500).json({ success: false, error: "Database not connected" });
    }

    // Extract values to update from the request body
    const { name, email, school, netId, photo } = req.body;

    console.log("Request body received:", { name, email, school, netId, photo });

    // Validate that all required fields are provided
    if (!name || !email || !school || !netId) {
      console.warn("Missing required fields in request body");
      return res.status(400).json({ success: false, error: "All fields (name, email, school, netId) are required" });
    }

    console.log("Updating user information in the database...");
    // Update the user information in the database
    const usersCollection = db.collection("users");
    const updateResult = await usersCollection.updateOne(
      { userId }, // Filter by userId
      {
        $set: {
          name,
          email,
          school,
          netId,
          photo: photo || null, // Update photo if provided, otherwise set to null
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      console.warn(`User with ID ${userId} not found in the database`);
      return res.status(404).json({ success: false, error: "User not found" });
    }

    console.log(`User with ID ${userId} updated successfully`);
    // Return success response
    res.status(200).json({ success: true, message: "User information updated successfully" });
  } catch (error: any) {
    console.error("Error updating user info:", error.message);
    res.status(500).json({ success: false, error: error.message });
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