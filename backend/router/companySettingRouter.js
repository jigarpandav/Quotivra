const express = require("express");
const companyRouter = express.Router();
const upload = require("../config/multer");

const {
  createCompanySetting,
  updateCompanySetting,
  getCompanySetting,
} = require("../controller/companySettingController");

companyRouter.post("/company-setting" ,upload.single("company_logo"), createCompanySetting);

companyRouter.put("/company-settings/update" , upload.single("company_logo") , updateCompanySetting)

companyRouter.post("/company-settings" , upload.none(), getCompanySetting)


module.exports = companyRouter;