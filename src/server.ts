import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/database.js";
import authRouter from "./routes/auth-router.js";
import userRouter from "./routes/user-router.js";
import walletRouter from "./routes/wallet-router.js";
import uploadRouter from "./routes/upload-router.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", walletRouter);
app.use("/", uploadRouter);

// Initialize database connection
connectDB().then(connectedDb => {
  if (connectedDb) {
    console.log("Database connected successfully");
  } else {
    console.error("Failed to connect to database");
  }
}).catch(console.error);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Backend Todos:
// [x] Create Node.js project (Done by initializing above)
// [x] Add endpoint for wallet creation (Logic needs implementation)
// [ ] Add endpoint for crypto to BRB (Logic needs implementation)
// [x] Connect MongoDB (Connected, ready for database schema)
// [x] Add Firebase authentication (Initialized, ready for use)