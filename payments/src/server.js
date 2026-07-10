const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { validatePayment, triggerFulfillment } = require("./settlement");

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

const recentEvents = [];
const MAX_EVENTS = 50;

function recordEvent(event, result) {
  const entry = {
    id: uuidv4(),
    receivedAt: new Date().toISOString(),
    event,
    result,
  };
  recentEvents.unshift(entry);
  if (recentEvents.length > MAX_EVENTS) {
    recentEvents.pop();
  }
  return entry;
}

function buildSamplePayment() {
  const tokenAmount = Math.floor(Math.random() * 200) + 50;
  const tokenPriceAtOrderTime = Number((Math.random() * 0.005 + 0.001).toFixed(4));
  const expectedAmount = Number((tokenAmount * tokenPriceAtOrderTime).toFixed(4));

  return {
    orderId: `order_${String(Math.floor(Math.random() * 900) + 100)}`,
    tokenAmount,
    tokenPriceAtOrderTime,
    expectedAmount,
    token: "NTE",
    timestamp: Date.now(),
  };
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "nodemeta-payments", port });
});

app.get("/events", (_req, res) => {
  res.json({ events: recentEvents });
});

app.post("/webhook/payment-received", async (req, res) => {
  const event = req.body;

  if (!event || !event.orderId) {
    const result = { accepted: false, reason: "Malformed payment event" };
    recordEvent(event || {}, result);
    return res.status(400).json(result);
  }

  try {
    const validation = await validatePayment(event);

    if (!validation.valid) {
      const result = { accepted: false, reason: validation.reason || "Payment validation failed" };
      recordEvent(event, result);
      return res.status(400).json(result);
    }

    const fulfillment = await triggerFulfillment(event.orderId);
    const result = { accepted: true, validation, fulfillment };
    recordEvent(event, result);
    return res.json(result);
  } catch (error) {
    const result = { accepted: false, reason: error.message };
    recordEvent(event, result);
    return res.status(500).json(result);
  }
});

setInterval(() => {
  const sample = buildSamplePayment();
  console.log("[webhook-simulator] Payment event:", JSON.stringify(sample));
}, 30000);

app.listen(port, () => {
  console.log(`💳 NodeMeta payments server running on port ${port}`);
  console.log("[webhook-simulator] Sample payment events will log every 30 seconds");
});

module.exports = app;
