const generateToken = (user,message,res) => {
  const token = user.generatejsonwebtoken();
  // console.log(token)
  const cookiename = user.role == "User" ? "User" : "Shopkeeper";
  res.status(200).cookie(cookiename, token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    })
    .json({ success: true, message,user });
};
module.exports = {
  generateToken,
};
