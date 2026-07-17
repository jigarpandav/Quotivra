const mongoose = require("mongoose");

const companyStettingSchema = new mongoose.Schema({
    admin_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        required:true,
    },
    company_name:{
        type:String,
        required:true,
        minlength:3,
    },
    company_logo: {
        type:String,
        required:true,
    },
    address:{
        type:String,
        required: true,
        minlength:3,
    },
    city:{
        type:String,
        required: true,
        minlength:3,
    },
    state:{
        type:String,
        required: true,
        minlength:3,
    },
    contact:{
        type:Number,
        required:true,
        minlength:10,
        maxlength:10,
        match:[/^[6-9]\d{9}$/, "Please enater a valid Indian contact number "],
    },
     alternative_contact:{
        type:Number,
        minlength:10,
        maxlength:10,
        match:[/^[6-9]\d{9}$/, "Please enater a valid Indian contact number "],
    },
    website: {
        type:String,
        trim:true,
        match: [
        /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/,
        "Please enter a valid website URL"
        ]   
    },
    terms_conditions:{
        type:String,
        default:"The prices mentioned in this quotation are valid for 15 days from the date of issue. Taxes, if applicable, will be charged extra. Goods will be supplied subject to product availability and the agreed payment terms."
    },
    signature: {
        type:String,

    },
    GST:{
        type:String,
        required:true,
        uppercase:true,
        trim:true,
        match:[/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[1-9A-Z]{1}$/,"Please entera valid GST number"]
    }

},
{
    timestamps:true
})

const CompanySetting = mongoose.model("CompanySettings",companyStettingSchema);

module.exports = CompanySetting;