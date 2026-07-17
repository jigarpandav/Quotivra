const express = require("express");
const multer = require("multer");
const upload = multer();
const dashboardRouter = express.Router();

const {
    getDashboardData,
} = require("../controller/dashboardController");

dashboardRouter.post("/dashboard", upload.none(), getDashboardData);

module.exports = dashboardRouter;
