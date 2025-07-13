import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
const app = express();
dotenv.config();


app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Junaid Ahammed!');
});

// Start the server
const PORT: number = Number(process.env.PORT) || 5000;
const MONGO_URI: string = process.env.MONGO_URI || "mongodb://localhost:27017/auth-db";

mongoose.connect(MONGO_URI).then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
        console.log(`Auth service running on port ${PORT}`);
    });
}).catch(err => console.error("Mongo error:", err));