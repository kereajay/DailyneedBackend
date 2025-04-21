const express = require("express");
const ProductRouter = express.Router();
const { Createproduct,getallproducts,getproductbyid,updateproduct } = require("../Controller/Products");
const { IsShopkeeperauthenticated,IsUserauthenticated  }=require('../Middleware/Auth')



ProductRouter.post("/addproduct", Createproduct);

ProductRouter.get("/getallproducts", getallproducts);
ProductRouter.get("/getproduct/:id",IsUserauthenticated, getproductbyid);
ProductRouter.put("/updateproduct/:id",IsUserauthenticated, updateproduct);
module.exports = ProductRouter;
