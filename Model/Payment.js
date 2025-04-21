const mongoose=require("mongoose");
const PaymentSchema=new mongoose.Schema(
    {
        razorpay_order_id: {
            type: String,
            required: true,
        },
        razorpay_payment_id: {
            type: String,
            required: true,
        },
        razorpay_signature: {
            type: String,
            required: true,
        },
        products:[],
        userId:{
            type:String,
            required:true
        },
        amount:{
            type:Number,
            required:true
        }
    }
)
const PaymentModel=mongoose.model("payment",PaymentSchema)
module.exports= PaymentModel