const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/restaurants", require("./routes/restaurants"));
app.use("/api/menu", require("./routes/menu"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/search", require("./routes/search"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/hier", require("./routes/hier"));
app.use("/api/email", require("./routes/email"));
app.use("/api/payment", require("./routes/paymentRoutes")); 

async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "FoodDelivery",
    });
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err);
    process.exit(1);
  }

  const PORT = Number(process.env.PORT) || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();