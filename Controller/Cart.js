const CartModel = require("../Model/Cart");
const ProdutsModel = require("../Model/Products");

const Addtocart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;
  try {
    let usercart = await CartModel.findOne({ userId })
    let productdetails=await ProdutsModel.findById(productId)
    
    // console.log(usercart)
    if (!usercart) {
      usercart = await CartModel.create({
        userId,
        products: [{ productId, quantity,productdetails }],
      });
    } else {
      const productindex = usercart.products.findIndex(
        (item) => item.productId.toString() == productId
      );
      if (productindex !== -1) {
        usercart.products[productindex].quantity += quantity;
      } else {
        usercart.products.push({ productId, quantity,productdetails });
      }
      await usercart.save();
    }
    await ProdutsModel.findByIdAndUpdate(productId, {
      $inc: { stock: -quantity },
    });
    //    console.log(product.stock)
    res.json({ success: true, message: "product added to cart", usercart });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: err.message || "internal server error",
      });
  }
};

const getcart = async (req, res) => {
  try {
    const userIdG = req.user._id;
    // console.log(userIdG);
    const cartUser = await CartModel.findOne({ userId: userIdG });
    // .populate("products.productId");
    // console.log(cartUser)
    if (!cartUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Nothing in cart with respect to current user",
        });
    }
    res.json({ success: true, cartUser });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: err.message || "internal server error",
      });
  }
};

const removefromcart = async (req, res) => {
  const { productId } = req.body;
  const userid = req.user._id;
  // console.log(userid)
  try {
    const cartuser = await CartModel.findOne({ userId: userid });
    // console.log(cartuser)
    if (!cartuser) {
      res
        .status(202)
        .json({
          success: false,
          message: "There are no cart items with respect to the current user",
        });
    }
    const rindex = cartuser.products.findIndex(
      (item) => item.productId.toString() == productId
    );
    let removedquantity = cartuser.products[rindex].quantity;
    // console.log(removedquantity)
    if (rindex !== -1) {
      cartuser.products.splice(rindex, 1);
    }
    await cartuser.save();
    await ProdutsModel.findByIdAndUpdate(productId, {
      $inc: { stock: +removedquantity },
    });
    res.json({ success: true, cartuser });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: err.message || "internal server error",
      });
  }
};

const reducingproductquantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const userid = req.user._id;

  try {
    const cartuser = await CartModel.findOne({ userId: userid });
    // console.log(cartuser);
    if (!cartuser) {
      res
        .status(202)
        .json({
          success: false,
          message: "There are no cart items with respect to the current user",
        });
    }
    const rindex = cartuser.products.findIndex(
      (item) => item.productId.toString() == productId
    );
    cartuser.products[rindex].quantity -= quantity;
    await cartuser.save();
    await ProdutsModel.findByIdAndUpdate(productId, {
      $inc: { stock: +quantity },
    });
    res.json({ success: true, cartuser });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: err.message || "internal server error",
      });
  }
};

module.exports = {
  Addtocart,
  getcart,
  removefromcart,
  reducingproductquantity,
};
