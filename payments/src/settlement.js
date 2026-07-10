const fulfillmentApi = require("../lib/fulfillmentApi");

// TODO: Candidate implements — check if tokenAmount * tokenPriceAtOrderTime >= expectedAmount within 2% slippage tolerance. Return { valid: true } or { valid: false, reason: '...' }
async function validatePayment(_event) {
  return { valid: false, reason: "Not implemented — candidate should validate payment within 2% slippage" };
}

// TODO: Candidate implements — call fulfillmentApi.fulfillOrder(orderId). If fulfillment API fails, do NOT mark order as paid. Ensure the operation is safely retryable.
// TODO: Candidate implements — ensure duplicate webhooks for the same orderId are not processed twice
async function triggerFulfillment(_orderId) {
  return {
    success: false,
    reason: "Not implemented — candidate should trigger fulfillment safely",
  };
}

module.exports = {
  validatePayment,
  triggerFulfillment,
  fulfillmentApi,
};
