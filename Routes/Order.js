const express = require("express");
const OrderRoute = express.Router();
const {createOrder,verifyPayment} = require("../Controller/Order");
const { IsUserauthenticated } = require("../Middleware/Auth");


// Create an order from the cart
OrderRoute.post("/createorder",IsUserauthenticated, createOrder);

// Verify the payment after Razorpay callback
OrderRoute.post("/verify-payment",verifyPayment);

module.exports = OrderRoute;
