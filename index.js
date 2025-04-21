const express=require('express');
const dotenv=require('dotenv');
const cookieParser=require('cookie-parser');
const mongoose=require('mongoose');
const cors=require('cors')
const UserRouter=require('./Routes/User')
const ProductRouter=require('./Routes/Products')
const CartRoute=require('./Routes/Cart')
const OrderRoute=require('./Routes/Order')
const PaymentRouter=require("./Routes/Payments")
const { v2: cloudinary } = require("cloudinary");
const fileUpload=require('express-fileupload')

dotenv.config();
const app=express();

//mongoose atlas connection
mongoose.connect(process.env.DATABASEURI).then(()=>{
  console.log("database connected successfully")
}).catch((err)=>console.log(err));

//clodinary config
cloudinary.config({
  cloud_name:process.env.CLOUDINARYCLOUDNAME,
  api_key:process.env.CLOUDINARYAPIKEY,
  api_secret:process.env.CLOUDINARYAPISECRET,
})
  

//cors handling
app.use(cors({
    origin:[
        "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://dailyneed-frontend.vercel.app"
      ],
      credentials:true,
})
);
app.use(cookieParser());
app.use(express.json());

//express file uploader middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use('/api/v1/user',UserRouter);
app.use('/api/v1/products',ProductRouter);
app.use('/api/v1/cart',CartRoute);
app.use('/api/v1/orders',OrderRoute);
app.use('/api/v1/payment',PaymentRouter);
app.listen(3300,console.log("server is on port 33000"));