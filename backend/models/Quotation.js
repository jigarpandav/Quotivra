const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema({
    admin_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        required:true,
    },
    quotationNo: {
        type:Number,
    },
    customer_name:{
        type:String,
        required:true,
        trim:true,
    },
    customer_contact: {
        type:String,
        minlength:10,
        maxlength:10,
        match:[/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"],
        required:true,
        trim:true,
    },
    quotation_date:Date,
    total_quantity:{
        type:Number,
    },
    total_amount:Number,
    status:{
        type:String,
        default:"draft",
        enum:["draft","approved","rejected"]
    },
    
},
{
    timestamps:true,
})

const Quotation = mongoose.model("Quotation",quotationSchema);

module.exports = Quotation;