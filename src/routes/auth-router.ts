import { Router, Request, Response, NextFunction } from 'express';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../utils/firebase.js';
import { getDB } from '../utils/database.js';
import { validatePassword } from '../utils/validation.js';
import { User } from '../models/index.js';

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
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
    const db = getDB();
    if (db) {
      const usersCollection = db.collection<User>("users");
      const userInfo: User = {
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
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ success: false, error: errorMessage });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  console.log("Login request received:", req.body);
  const { email, password } = req.body;

  try {
    // Authenticate the user with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userId = user.uid;

    const db = getDB();
    if (!db) {
      return res.status(500).json({ success: false, error: "Database not connected" });
    }

    // Check if the user exists in the MongoDB database
    const usersCollection = db.collection<User>("users");
    const existingUser = await usersCollection.findOne({ userId });

    if (!existingUser) {
      // If the user does not exist, add them to the database
      const userInfo: User = {
        userId,
        name: user.displayName || "Unknown", // Use Firebase displayName or a default value
        email: user.email!,
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
    console.error("Login error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

router.post("/logout", ((req: Request, res: Response, next: NextFunction) => {
  signOut(auth)
    .then(() => {
      res.json({ success: true, message: "Signed out successfully" });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
}) as any);

export default router;
