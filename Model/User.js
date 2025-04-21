const mongoose = require("mongoose");
const becrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const userScheama = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First anme required"],
      minLength: [3, "First name contain atleast three letters"],
    },
    lastname: {
      type: String,
      required: [true, "First anme required"],
      minLength: [3, "First name contain atleast three letters"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      validate: [validator.isEmail, "Provide a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      minLength: [10, "Phone number should be atleast ten digits"],
      maxLength: [10, "Phone number should be atleast ten digits"],
    },
    dob: {
      type: Date,
      required: [true, "DOB Is Required!"],
    },
    gender: {
      type: String,
      required: [true, "Gender Is Required!"],
      enum: ["Male", "Female","Other"],
    },
    password: {
      type: String,
      required: [true, "Password Is Required!"],
      minLength: [8, "Password Must Contain At Least 8 Characters!"],
      select: false,
    },
    role: {
      type: String,
      required: [true, "User Role Required!"],
      enum: ["Shopkeeper", "User"],
    },
  },
  {
    timestamps: true,
  }
);
userScheama.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await becrypt.hash(this.password,5);
})
userScheama.methods.comparepasswoed=async function(enteredpassword){
    return await becrypt.compare(enteredpassword,this.password);
}
userScheama.methods.generatejsonwebtoken= function(){
return  jwt.sign({id:this._id},process.env.JWTSECRET,{
    expiresIn:"24h"
})
}

const UserModel=mongoose.model("users",userScheama);
module.exports=UserModel;
