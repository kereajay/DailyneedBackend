const mongoose = require("mongoose");

const calculateDiscountedPrice = (price, discount) => {
  return price - price * (discount / 100);
};

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"] },
    description: { type: String, required: [true, "Description is required"] },
    price: { type: Number, required: [true, "Price is required"] },
    unit: { type: String, required: [true, "Unit type is required"] },
    productimage: { type: String  },
    category: { type: String, required: [true, "Category is required"] },
    trending: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    newAdded: { type: Boolean, default: false },
    stock: { type: Number, required: [true, "Stock quantity is required"] },
    instock: { type: Boolean, default: true },
    brand: { type: String, required: [true, "Brand name is required"] },
    nutrients: {
      type:String,
      required:[true,"nutrients required"]

    },
    // protein: { type: String, 
    //   // required: [true, "Protein value is required"] 
    // },
    // carbohydrates: {
    //   type: String,
    //   // required: [true, "Carbohydrate value is required"],
    // },
    // fats: { type: String, 
    //   // required: [true, "Fat value is required"] 
    // },
    // },
    manufactureDate: {
      type: Date,
      required: [true, "Manufacture date is required"],
    },
    lifespan: { type: String, required: [true, "Lifespan is required"] },
    additionalInfo: { type: String },
    tags: { type: String },
    discount: { type: Number, default: 0 },
    discountedPrice: { type: Number },
    reviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.discount && this.price) {
    this.discountedPrice = calculateDiscountedPrice(this.price, this.discount);
  }else{
    this.discountedPrice=this.price;
  }
  next();
});

const ProdutsModel = mongoose.model("Products", productSchema);
module.exports = ProdutsModel;
