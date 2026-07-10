/**
 * Mock fulfillment API — FULLY WORKING, candidates do NOT modify this file.
 */
function fulfillOrder(orderId) {
  if (!orderId || typeof orderId !== "string") {
    throw new Error("Invalid orderId");
  }

  // DOCUMENTED FAILURE MODE: orderIds ending with "_FAIL" simulate fulfillment API failure
  if (orderId.endsWith("_FAIL")) {
    throw new Error(`Fulfillment failed for order ${orderId}`);
  }

  const shippingId = `SHIP_${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  return {
    success: true,
    orderId,
    shippingId,
    estimatedDelivery: "3-5 business days",
  };
}

module.exports = {
  fulfillOrder,
};
