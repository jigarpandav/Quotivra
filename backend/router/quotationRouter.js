const express = require("express");
const multer = require("multer");
const upload = multer();
const quotationRouter = express.Router();
const {
  createQuotation,
  updateQuotation,
  getAllQuotations,
  getQuotationById,
  deleteQuotation,
} = require("../controller/quotationController");

quotationRouter.post("/quotation", upload.none(), createQuotation);

quotationRouter.put("/quotation/update", upload.none(), updateQuotation);

quotationRouter.post("/quotations", upload.none(), getAllQuotations);

quotationRouter.post("/quotation/id", upload.none(), getQuotationById);

quotationRouter.post("/quotation/delete", upload.none(), deleteQuotation);


module.exports = quotationRouter;