import { Router, Request, Response } from 'express';
import { Keypair } from '@solana/web3.js';
import { getDB } from '../utils/database.js';
import { Wallet } from '../models/index.js';

const router = Router();

router.post("/wallet", async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        error: "Authentication required" 
      });
    }

    const db = getDB();
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
    const walletDoc: Wallet = {
      userId: authHeader,
      publicKey: publicKey,
      privateKey: privateKey,
      createdAt: new Date()
    };

    // Store wallet in MongoDB
    const walletsCollection = db.collection<Wallet>("wallets");
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
router.post("/convert", (req: Request, res: Response) => {
  // Conversion logic here
  res.send("Crypto-to-BRB conversion endpoint - Logic not implemented yet");
});

export default router;
