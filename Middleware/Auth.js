const jwt = require("jsonwebtoken");
const UserModel = require("../Model/User");

const IsUserauthenticated = async (req, res, next) => {
  try {
    const token=req.cookies.User;
    if(!token){
        res.status().json({success:false,message:"User not authenticated"})
    }
    const decode=jwt.verify(token,process.env.JWTSECRET);
    req.user=await UserModel.findById(decode.id);
    // console.log(req.user)
    if(req.user.role!=="User"){
       res.status().json({success:false,message:`${req.user.role} is not autorized for this resources`})

    }
    // console.log(req.user)
    next();


  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err.message || "Internal server error" });
  }
};
const IsShopkeeperauthenticated= async(req,res,next)=>{
    try{
        const token=req.cookies.Shopkeeper;
        // console.log(token);
        if(!token){
          return  res.status(401).json({success:false,message:"Not authenticated"}) 
        }
        const decode=jwt.verify(token,process.env.JWTSECRET);
        req.user=await UserModel.findById(decode.id);
      
        if(req.user.role!=="Shopkeeper"){
          return   res.status(401).json({success:false,message:`${req.user.role} is not autorized for this resources`})
        }
        next();

    }
    catch(err){
        res.status(500).json({success:false,message:err.message || "Internal server error"})
    }
}

module.exports={
    IsShopkeeperauthenticated,
    IsUserauthenticated,
}
