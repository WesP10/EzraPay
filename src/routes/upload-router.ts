import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ObjectId } from 'mongodb';
import { getDB } from '../utils/database.js';
import { Photo } from '../models/index.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string; // Ensure the user is authenticated
    if (!userId) {
      return res.status(401).json({ success: false, error: "User ID is required in headers" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const db = getDB();
    if (!db) {
      return res.status(500).json({ success: false, error: "Database not connected" });
    }

    const photoBuffer = req.file.buffer;

    // Insert the photo into the database
    const photoDoc: Photo = {
      userId,
      data: photoBuffer,
      mimeType: req.file.mimetype,
      createdAt: new Date(),
    };

    const result = await db.collection<Photo>("photos").insertOne(photoDoc);

    res.json({ success: true, photoId: result.insertedId });
  } catch (error) {
    console.error("Error uploading file:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ success: false, error: errorMessage });
  }
});

router.get("/photo/:id", async (req: Request, res: Response) => {
  try {
    const photoId = req.params.id;

    const db = getDB();
    if (!db) {
      return res.status(500).json({ success: false, error: "Database not connected" });
    }

    // Find the photo in the database
    const photo = await db.collection<Photo>("photos").findOne({ _id: new ObjectId(photoId) });

    if (!photo) {
      return res.status(404).json({ success: false, error: "Photo not found" });
    }

    // Set the correct Content-Type header and send the binary data
    res.set("Content-Type", photo.mimeType);
    res.send(photo.data.buffer); // Use `.buffer` to send the raw binary data
  } catch (error) {
    console.error("Error retrieving photo:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ success: false, error: errorMessage });
  }
});

export default router;
