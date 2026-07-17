const  mongoose  = require("mongoose");



const adminSchema = new mongoose.Schema({
    name:{
        type: String,
        minlength:3,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
         match: /^\S+@\S+\.\S+$/,
    },
    password:{
        type:String,
        required:true,
        minlength: 6,
    },
    resetPasswordToken:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    }
},
{
    timestamps:true
})

const Admin = mongoose.model("Admin",adminSchema);

module.exports = Admin;
