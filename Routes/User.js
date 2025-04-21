const express = require("express");
const UserRouter = express.Router();
const { usersignup, Userlogin,getcurrentuser,userlogout,Shopkeeperlogout,getcurrentShopkeeper } = require("../Controller/User");
const {
  IsShopkeeperauthenticated,
  IsUserauthenticated,
} = require("../Middleware/Auth");

UserRouter.post("/signup", usersignup);
UserRouter.post("/login", Userlogin);
UserRouter.get("/getUser", IsUserauthenticated,getcurrentuser);
UserRouter.get("/getShopkeeper", IsShopkeeperauthenticated,getcurrentShopkeeper);
UserRouter.get("/userlogout", IsUserauthenticated,userlogout);
UserRouter.get("/shopkeeperLogout", IsShopkeeperauthenticated,Shopkeeperlogout);
module.exports = UserRouter;
