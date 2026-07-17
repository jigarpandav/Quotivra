const adminModel = require("../models/Admin");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const {generateToken} = require("../config/generateToken")
const sendEmail = require("../config/mail");
const mongoose = require("mongoose");

const registerAdmin = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" })
        }

        let existingEmail = await adminModel.findOne({ email });



        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "Email is already used, please login"
            });

        }
        let hashPassword = await bcrypt.hash(password, 10)
        let newAdmin = await adminModel.create({
            name,
            email,
            password: hashPassword
        });

        return res.status(201).json({
            success: true,
            message: "Registration Successfully",
            data: newAdmin
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const loginAdmin = async (req,res) => {
        try{
            let {email,password} = req.body;
            if(!email || !password){
                return res.status(400).json({
                    success: false,
                    message:"email and password are required"
                })
            }
                const admin = await adminModel.findOne({email})

                if(!admin){
                    return res.status(404).json({
                        success: false,
                        message:"admin not found"
                    })
                }

                const comparePassword = await bcrypt.compare(password,admin.password);


                if(!comparePassword){
                    return res.status(401).json({
                        success: false,
                        message:"Invalid Password"
                    })
                }
                const token = jwt.sign(
                  {
                    id: admin._id,
                    email: admin.email,
                  },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "7d",
                  }
                );
                return res.status(200).json({
                    success: true,
                    message:"Login Successful",
                    data:admin,
                    token:token,
                    admin_id: admin._id
                })

        }catch(err){
            console.log(err);
            return res.status(500).json({
                success: false,
                message:"Internal server error"
            })
        }
}

// const adminChangePassword = async (req,res) => {
//     try{
        
//         const { adminId,oldPassword, newPassword} = req.body

//         if(!adminId || !oldPassword || !newPassword){
//             return res.status(400).json({
//                 message:"admin Id,old & new Password is required"
//             })
//         }
//         const admin = await adminModel.findById(adminId)
//         if(!admin){
//             return res.status(404).json({
//                 message:"Admin not found",
//             })
//         }
//         const OldPassword = await bcrypt.compare(oldPassword ,admin.password);
//         if(!OldPassword){
//             return res.status(401).json({
//                 message:"old password is not match" 
//             })
//         }

//         const hashPassword = await bcrypt.hash(newPassword,10);

// const changePassword = await adminModel
//   .findByIdAndUpdate(
//     adminId,
//     { password: hashPassword },
//     { new: true }
//   )
//   .select("-password");
//         return res.status(200).json({
//             message:"password change successfully",
//             data:changePassword
//         })
    
//     }catch(err){
//         console.log(err)
//         return res.status(500).json({
//             message:"Internal server error"
//         })
//     }
// }

const getAdmin = async (req, res) => {
  try {
    const { admin_id } = req.body;

    if(!admin_id){
      return res.status(400).json({
        message: "Admin ID is required"
      });
    }
    const admin = await adminModel.findById(admin_id)
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }
    return res.status(200).json({
      message: "Admin retrieved successfully",
      data: admin
    });
  }catch(err){
    console.log(err)
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const admin = await adminModel.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const token = generateToken();
    const expiry = new Date(Date.now() + 3600000);

    admin.resetPasswordToken = token;
    admin.resetPasswordExpires = expiry;
    await admin.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const mailInfo = await sendEmail(
      normalizedEmail,
      "Password Reset Request",
      `
      <p>You requested a password reset.</p>
      <p>Click below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      `
    );

    if (mailInfo.rejected?.length) {
      return res.status(502).json({
        message: "Email provider rejected the reset email",
      });
    }

    return res.status(200).json({
      message: "Password reset link sent to your email",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



const resetPassword = async(req,res) => {
    try{
        const token = req.params.token;
        const {newPassword} = req.body;

        if(!token || !newPassword){
            return res.status(400).json({
                message:"Token and new password are required"
            })
        }
        const admin = await adminModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Check if token is not expired
        });

        if(!admin){
            return res.status(404).json({
                message:"Invalid or expired reset token"
            })
        }

        const hashPassword = await bcrypt.hash(newPassword,10);

        const result = await adminModel.updateOne(
            {resetPasswordToken: token},
            {
                $set:{
                    password: hashPassword,
                },
                $unset:{
                    resetPasswordToken: "",
                    resetPasswordExpires: ""
                },
            },
        );
        res.status(200).json({
            message:"Password reset successfully",
            acknowledged: result.acknowledged,
            modifiedCount: result.modifiedCount
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Internal server error"
        })
    }

}

const changePassword = async (req, res) => {
  try {
    const { admin_id, newPassword, oldPassword } = req.body;

    if (!admin_id || !newPassword || !oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Admin ID, old password, and new password are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(admin_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin ID",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const admin = await adminModel.findById(admin_id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      admin.password
    );

    if (!isOldPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      admin.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from old password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("Change password error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
    registerAdmin,
    loginAdmin,

    getAdmin,
    forgotPassword,
    resetPassword,
    changePassword,
}
