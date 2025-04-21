const ProdutsModel = require("../Model/Products");
const { v2: cloudinary } = require("cloudinary");

const Createproduct = async (req, res) => {
  // console.log(Object.keys(req.files).length);
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.json({ success: false, message: "product image required" });
    }

    const { productimage } = req.files;
    // console.log(productimage)
    const allowedFormats = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/avif",
    ];
    if (!allowedFormats.includes(productimage.mimetype)) {
      return res.json({
        success: false,
        message: "File format Not Supported!",
      });
    }
    const {
      name,
      description,
      price,
      unit,
      category,
      trending,
      bestSeller,
      stock,
      instock,
      brand,
      nutrients,
      manufactureDate,
      lifespan,
      additionalInfo,
      tags,
      discount,
      discountedPrice,
      reviews,
    } = req.body;

  

    if (
      !name ||
      !description ||
      !price ||
      !unit ||
      !category ||
      !trending ||
      !bestSeller ||
      !stock ||
      !instock ||
      !brand ||
     
      !manufactureDate ||
      !lifespan ||
      !additionalInfo ||
      !tags ||
      !discount ||
      // !discountedPrice ||
      !reviews
    ) {
      return res
        .status(404)
        .json({ success: false, message: "Complete all the details" });
    }
    const cloudinaryresponse = await cloudinary.uploader.upload(
      productimage.tempFilePath,
      {
        folder: "Grocery",
      }
    );
    // console.log(cloudinaryresponse)
    if (!cloudinaryresponse || cloudinaryresponse.error) {
      return res.json({
        success: false,
        message: "Failed to upload product image",
      });
    }

    
    const product =await  ProdutsModel.create({
      name,
      description,
      price,
      unit,
      category,
      trending,
      bestSeller,
      stock,
      instock,
      brand,
      nutrients,
      manufactureDate,
      lifespan,
      additionalInfo,
      tags,
      discount,
      discountedPrice,
      reviews,
      productimage: cloudinaryresponse.secure_url,
      
    });
    res.status(200).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
const getallproducts= async (req,res)=>{
try{
  const products=await ProdutsModel.find();
  // console.log(products);
  res.status(200).json({success:true,message:"all products are here",products})

}
catch(err){
  res.status(500).json({success:false,message:err.messge || "Internal server error"})
}
}

const getproductbyid=async (req,res)=>{
 
  const {id}=req.params;

  try{
    const product=await ProdutsModel.findById(id)
    res.status(200).json({success:true,message:"Found a product with id",product})
    console.log(id);
  }
  catch(err){
  res.status(500).json({success:false,message:err.messge || "Internal server error"})

  }
}

const updateproduct=async (req,res)=>{
  const {id}=req.params

  const updateddata=req.body;
  try{
   
    const updatedproduct=await ProdutsModel.findByIdAndUpdate(id,updateddata,{
      new:true,
    })
    if(!updatedproduct){
      return res.status(404).json({success:false,message:`product with ${id} not found `})
    }
    res.status(200).json({success:true,message:`product updated for value ${updateddata}`})

  }
  catch(err){
    res.status(500).json({success:false,message:err.messge || "Internal server error"})

  }
}

// const onlyuploadimages=async()=>{
//   try{
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.json({ success: false, message: "product image required" });
//     }

//     const { productimage } = req.files;
//     // console.log(productimage)
//     const allowedFormats = [
//       "image/png",
//       "image/jpeg",
//       "image/jpg",
//       "image/webp",
//       "image/avif",
//     ];
//     if (!allowedFormats.includes(productimage.mimetype)) {
//       return res.json({
//         success: false,
//         message: "File format Not Supported!",
//       });
//     }
//     const cloudinaryresponse = await cloudinary.uploader.upload(
//       productimage.tempFilePath,
//       {
//         folder: "Grocery",
//       }
//     );
//     // console.log(cloudinaryresponse)
//     if (!cloudinaryresponse || cloudinaryresponse.error) {
//       return res.json({
//         success: false,
//         message: "Failed to upload product image",
//       });
//     }


//   }
//   catch(err){
//     res.status(500).json({success:false,message:err.messge || "Internal server error"})
//   }
// }
module.exports = {
  Createproduct,
  getallproducts,
  getproductbyid,
  updateproduct,
  // onlyuploadimages
};
