import { Router, Request, Response } from 'express';
import { getDB } from '../utils/database.js';
import { User } from '../models/index.js';

const router = Router();

router.post("/userinfo", async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  console.log("Userinfo request received:", userId);

  try {
    const db = getDB();
    if (!db) {
      return res.status(500).json({ success: false, error: "Database not connected" });
    }

    // Query the MongoDB collection for the user
    const usersCollection = db.collection<User>("users");
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
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ success: false, error: errorMessage });
  }
});

router.post("/update-user", async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;

  try {
    console.log("Update-user endpoint accessed");

    if (!userId) {
      console.warn("Authorization header is missing");
      return res.status(401).json({ success: false, error: "Authorization header is required" });
    }

    const db = getDB();
    if (!db) {
      console.error("Database not connected");
      return res.status(500).json({ success: false, error: "Database not connected" });
    }

    // Extract values to update from the request body
    const { name, email, school, netId, photo } = req.body;

    console.log("Request body received:", { name, email, school, netId, photo });

    console.log("Updating user information in the database...");
    // Update the user information in the database
    const usersCollection = db.collection<User>("users");
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

export default router;
