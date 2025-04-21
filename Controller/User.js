const UserModel = require("../Model/User");
const { generateToken } = require("../Utils/JWTtokengeneration");

const usersignup = async (req, res) => {
  const { firstname, lastname, email, phone, dob, gender, password, role } =
    req.body;
  // console.log(firstname, lastname, email, phone, dob, gender, password, role);
  try {
    if (
      !firstname ||
      !lastname ||
      !email ||
      !phone ||
      !dob ||
      !gender ||
      !password ||
      !role
    ) {
      return res
        .status(422)
        .json({ success: false, message: "fileds are missing" });
    }
    let user = await UserModel.findOne({ email: email });
    if (user) {
      return res.status(409).json({
        success: false,
        message: "user already exist with this email",
      });
    }
    user = await UserModel.create({
      firstname,
      lastname,
      email,
      phone,
      dob,
      gender,
      password,
      role,
    });
    res.json({
      success: true,
      message: "user created successfully",
      // user: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

const Userlogin = async (req, res) => {
  const { email, password, confirmpassword, role } = req.body;
  // console.log(email, password, confirmpassword, role);
  try {
    if (!email || !password || !confirmpassword || !role) {
      return res.status(422).json({
        success: false,
        message: "Please provide a valid credentials",
      });
    }
    if (password != confirmpassword) {
      return res.status(400).json({
        success: false,
        error: "Password and confirmpassword is not matching",
      });
    }
    let user = await UserModel.findOne({ email: email }).select("+password");
    if (!user) {
      return res.status(409).json({
        success: false,
        message: "User with this Email or password not found",
      });
    }
    if (user.role != role) {
      return res
        .status(400)
        .json({ success: false, message: "role not macthing" });
    }
    const ispasswordmatching = await user.comparepasswoed(password);
    if (!ispasswordmatching) {
      res
        .status(401)
        .json({ success: false, message: "password not macthing" });
    }
    generateToken(user, `${role} logged in successfully`, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
const getcurrentuser = async (req, res) => {
  try {
    // const currentuser = req.user;
    // console.log(req.user._id);
    const user = await UserModel.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
const getcurrentShopkeeper = async (req, res) => {
  try {
    // const currentuser = req.user;
    // console.log(req.user._id);
    const user = await UserModel.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

const userlogout = async (req, res) => {
  try {
   
    res.cookie("User", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
      secure: true,
    }).json({ success: true, message: "User logout successfully" });

  
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: err.message || "Internalserver error" });
  }
};
const Shopkeeperlogout = async (req, res) => {
  try {
   
    res.cookie("Shopkeeper", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
      secure: true,
    }).json({ success: true, message: "Shopkeeper logout successfully" });

  
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: err.message || "Internalserver error" });
  }
};
module.exports = {
  usersignup,
  Userlogin,
  getcurrentuser,
  getcurrentShopkeeper,
  userlogout,
  Shopkeeperlogout
};
