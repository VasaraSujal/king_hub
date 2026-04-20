const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const normalizePrice = (value) => {
  const numericValue = Number(value || 0);
  return Math.max(1, Math.round(numericValue * 100));
};

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;

    console.log("✅ Received Cart Items:", JSON.stringify(items, null, 2));

    if (!Array.isArray(items) || items.length === 0) {
      console.error("❌ Error: Cart is empty or invalid");
      return res.status(400).json({ error: "Cart is empty or invalid" });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name || item.foodname || item.itemName || "Food Item",
        },
        unit_amount: normalizePrice(item.price),
      },
      quantity: Number(item.quantity || 1),
    }));

    if (lineItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty or invalid" });
    }

    console.log("✅ Line Items Sent to Stripe:", JSON.stringify(lineItems, null, 2));

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    console.log("✅ Session Created Successfully:", session.url);
    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe Error:", error.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

module.exports = router;