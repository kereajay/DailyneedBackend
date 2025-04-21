const Razorpay = require("razorpay");
const crypto = require("crypto");
const OrderModel = require("../Model/Order"); // Order model
const CartModel = require("../Model/Cart"); 
const dotenv=require('dotenv');
dotenv.config();


// Initialize Razorpay instance
// console.log(process.env.RAZORPAY_KEY_ID);
const razorpay = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create an order based on the user's cart.
 * Assumes that the user is authenticated and their ID is available in req.user._id.
 */
const createOrder = async (req, res) => {
  try {
    console.log("inside create order");
    const userId = req.user._id; // You should have authentication middleware setting this
    // Fetch the cart for the logged in user
    console.log(userId)
    const cart = await CartModel.findOne({ userId }).populate("products.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Calculate total amount based on product prices and quantities.
    // Make sure each product has a price field.
    let totalAmount = 0;
    cart.products.forEach((item) => {
      totalAmount += item.productId.price * item.quantity;
    });

    // Create an order in Razorpay (amount in paisa)
    const options = {
      amount: totalAmount * 100, // converting to paisa
      currency: "INR",
      receipt: `receipt_${cart._id}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // Create order record in the database
    const newOrder = new OrderModel({
      cart: cart._id,
      userId,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
    });

    await newOrder.save();

    // Respond with the order details and Razorpay order info
    res.json({ order: newOrder, razorpayOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error });
  }
};

/**
 * Verify payment using Razorpay signature.
 * The request body must include:
 *  - razorpay_order_id
 *  - razorpay_payment_id
 *  - razorpay_signature
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Construct the expected signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Update the order status in the database as "paid"
      const order = await OrderModel.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "paid",
        },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Payment verified successfully",
        order,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature. Payment verification failed.",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment", error });
  }
};

module.exports={
    createOrder,
    verifyPayment
}
