const express = require("express");
const {
  Addtocart,
  getcart,
  removefromcart,
  reducingproductquantity,
} = require("../Controller/Cart");
const { IsUserauthenticated } = require("../Middleware/Auth");
const CartRoute = express.Router();
CartRoute.post("/addtocart", IsUserauthenticated, Addtocart);
CartRoute.get("/getcart", IsUserauthenticated, getcart);
CartRoute.post("/product/remove", IsUserauthenticated, removefromcart);
CartRoute.put(
  "/reduce/quantity",
  IsUserauthenticated,
  reducingproductquantity
);

module.exports = CartRoute;
