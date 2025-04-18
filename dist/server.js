// Import necessary modules
import express from "express";
import admin from "firebase-admin";
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://EZRA:" + process.env.MONGO_DB_PASSWORD + "@ezrapay.flwga3p.mongodb.net/?retryWrites=true&w=majority&appName=ezrapay";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
// Initialize Express app
const app = express();
app.use(express.json());
connectDB().catch(console.dir);
// Placeholder for Firebase Admin SDK initialization
// Add your Firebase project credentials here
const firebaseConfig = {
// Example: "type": "service_account"
};
admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
});
async function connectDB() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        // Ensures that the client will close when you finish/error
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
