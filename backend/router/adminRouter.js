const express = require("express");
const adminRouter = express.Router();
const multer = require("multer");
const ulpoad = multer();

const {
  registerAdmin,
  loginAdmin,
  getAdmin,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controller/authController");

adminRouter.post("/admin/register" , ulpoad.none(), registerAdmin);

adminRouter.post("/admin/login" , ulpoad.none(), loginAdmin);

adminRouter.post("/admin", ulpoad.none(), getAdmin);

adminRouter.post("/admin/forgot-password", ulpoad.none(), forgotPassword);

adminRouter.post("/admin/reset-password/:token", ulpoad.none(), resetPassword);

adminRouter.post("/admin/change-password", ulpoad.none(), changePassword);



module.exports = adminRouter;