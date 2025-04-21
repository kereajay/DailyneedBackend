const express = require("express");
const PaymentRouter = express.Router();
const { paymentorder,verifypaymnet } = require("../Controller/Payment");
const {IsUserauthenticated}=require("../Middleware/Auth")

PaymentRouter.post("/order",IsUserauthenticated, paymentorder);
PaymentRouter.post("/verify",IsUserauthenticated, verifypaymnet);
module.exports=PaymentRouter
