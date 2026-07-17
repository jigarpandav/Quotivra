const mongoose = require("mongoose");

const quotationItemsSchema = new mongoose.Schema({
    admin_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        required:true,
    },
    quotation_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Quotation",
        required:true,
    },
    product_name: {
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        min:[0,"Price can not be nagative"]
    },
    quantity:{
        type:Number,
    },
    total: {
        type:Number
    }
},
{
    timestamps:true
})

const QuotationItems = mongoose.model("QuotationItems", quotationItemsSchema);

module.exports = QuotationItems;
