import express, { Request, Response } from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Load environment variables
const BRBTokenAddress = process.env.BRB_TOKEN_ADDRESS || "0x1234567890abcdef1234567890abcdef12345678";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const RPC_URL = process.env.RPC_URL || "https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID";

// Initialize ethers.js
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const BRBTokenABI = [
  "function mint(address to, uint256 amount) external",
]; // Minimal ABI for interacting with the mint function
const BRBTokenContract = new ethers.Contract(BRBTokenAddress, BRBTokenABI, wallet);

// Mint tokens endpoint
router.post("/mint", async (req: Request, res: Response) => {
  const { recipient, amount } = req.body;

  if (!recipient || !amount) {
    return res.status(400).json({ error: "Recipient address and amount are required" });
  }

  try {
    console.log(`Minting ${amount} tokens to ${recipient}...`);

    // Convert the amount to the correct units (e.g., 18 decimals)
    const tx = await BRBTokenContract.mint(recipient, ethers.parseUnits(amount.toString(), 18));
    await tx.wait();

    console.log("Tokens minted successfully!");
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error minting tokens:", error);
    res.status(500).json({ error: "Failed to mint tokens", details: error.message });
  }
});

export default router;