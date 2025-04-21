const PaymentModel = require("../Model/Payment");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const UserModel=require("../Model/User")
const CartModel=require("../Model/Cart")
// const dotenv = require("dotenv");

// dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentorder = async (req, res) => {
  const { grandtotal } = req.body;

  try {
    const options = {
      amount: Math.round(Number(grandtotal) * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await razorpayInstance.orders.create(options);
    // console.log(order);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const verifypaymnet = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature,amount } =
    req.body;
    // const usernow=req.user;
    // console.log(usernow)
    const usercart=await CartModel.findOne({userId:req.user._id})
    const allproducts=usercart.products

  // console.log("req.body", req.body);

  try {
    // Create Sign
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    // Create ExpectedSign
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // console.log(razorpay_signature === expectedSign);

    // Create isAuthentic
    const isAuthentic = expectedSign === razorpay_signature;

    // Condition
    if (isAuthentic) {
      const payment = new PaymentModel({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        products:allproducts,
        userId:req.user._id,
        amount:amount
      });

      // Save Payment
      await payment.save();

      // Send Message
      await CartModel.findOneAndDelete({userId:req.user._id})
      res.json({
        message: "Payement Successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
};

module.exports = {
  paymentorder,
  verifypaymnet,
};
