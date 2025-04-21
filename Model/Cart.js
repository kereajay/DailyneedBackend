const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
      quantity: Number,
      productdetails:Object
    },
  ],
 
},{
    timestamps:true
});
const CartModel = mongoose.model("cart", cartSchema);
module.exports = CartModel;
