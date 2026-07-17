const quotationModel = require("../models/Quotation");
const quotationItemModel = require("../models/QuotationItems")
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const CompanySettingModel = require("../models/CompanySettings");
const fs = require("fs");
const path = require("path");


const createQuotation = async (req, res) => {
    try {
        const { admin_id, customer_name, customer_contact, quotation_date, total_amount, status } = req.body

        let products = req.body.products;

        if (!admin_id || !customer_name || !customer_contact) {
            return res.status(400).json({
                message: "admin_id,customer_name & customer_contact fields are required"
            })
        }
        const lastQuotation = await quotationModel.findOne({ admin_id }).sort({ createdAt: -1 })
            .select("quotationNo")
            .lean()

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Products are required",

            });

        }
        for (const product of products) {
            if (!product.product_name || !product.price || !product.quantity) {
                return res.status(400).json({
                    message: "Product name, price and quantity are required",
                });
            }
        }

        const nextQuotationIndex = (lastQuotation?.quotationNo || 0) + 1

        const quotationCreate = await quotationModel.create({
            admin_id,
            customer_name,
            customer_contact,
            quotation_date,
            total_amount,
            status,
            quotationNo: nextQuotationIndex
        })
        const quotationItemsCreate = products.map((product) => ({
            admin_id,
            quotation_id: quotationCreate._id,
            product_name: product.product_name,
            price: product.price,
            quantity: product.quantity,
            total: product.price * product.quantity
        }))


        const quotationItems = await quotationItemModel.insertMany(quotationItemsCreate)

        return res.status(201).json({
            message: "quotation successfully created",
            data: quotationCreate,
            items: quotationItems,
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error."
        })
    }
}

const updateQuotation = async (req, res) => {
    try {
        const {
            quotation_id,
            admin_id,
            customer_name,
            customer_contact,
            quotation_date,
            total_amount,
            status,

        } = req.body;
        const { products } = req.body
        if (
            !mongoose.Types.ObjectId.isValid(quotation_id) ||
            !mongoose.Types.ObjectId.isValid(admin_id)
        ) {
            return res.status(400).json({
                message: "Invalid quotation ID or admin ID"
            });
        }

        if (!quotation_id || !admin_id || !customer_name || !customer_contact) {
            return res.status(400).json({
                message: "quotation_id, admin_id, customer_name & customer_contact fields are required",
            });
        }

        const quotationExist = await quotationModel.findById(quotation_id);

        if (!quotationExist) {
            return res.status(404).json({
                message: "Quotation not found",
            });
        }

        if (quotationExist.status !== "draft") {
            return res.status(409).json({
                message: "Only draft quotation can be updated",
            });
        }
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                message: "Products are required",
                success: false,

            })
        }

        for (const product of products) {
            if (!product.product_name || !product.price || !product.quantity) {
                return res.status(400).json({
                    message: "Product name, price and quantity are required"
                })
            }
        }


        const updatedQuotation = await quotationModel.findByIdAndUpdate(quotation_id, {
            admin_id,
            customer_name,
            customer_contact,
            quotation_date,
            total_amount,
            status
        }, {
            new: true
        })

        await quotationItemModel.deleteMany({ quotation_id });

        const quotationItemsUpdate = products.map((product) => ({

            admin_id,
            quotation_id,
            product_name: product.product_name,
            price: product.price,
            quantity: product.quantity,
            total: product.price * product.quantity

        }))
        const quotationItems = await quotationItemModel.insertMany(quotationItemsUpdate)


        return res.status(200).json({
            message: "Quotation updated successfully",
            data: updatedQuotation,
            items: quotationItems
        })

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error."
        })
    }
}


const getAllQuotations = async (req, res) => {
  try {
    let {
      admin_id,
      limit = 5,
      page = 1,
      search = "",
      status = "",
      period = "",
    } = req.body;

    if (!admin_id) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(admin_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin ID",
      });
    }

    limit = Number.parseInt(limit, 10);
    page = Number.parseInt(page, 10);

    if (!Number.isInteger(limit) || limit < 1) {
      limit = 5;
    }

    if (!Number.isInteger(page) || page < 1) {
      page = 1;
    }

    const skip = (page - 1) * limit;

    const filter = {
      admin_id: new mongoose.Types.ObjectId(admin_id),
    };

    /* =========================
       SEARCH
    ========================= */

    const trimmedSearch = String(search).trim();

    if (trimmedSearch) {
      const searchConditions = [
        {
          customer_name: {
            $regex: trimmedSearch,
            $options: "i",
          },
        },
        {
          customer_contact: {
            $regex: trimmedSearch,
            $options: "i",
          },
        },
      ];

      const quotationNumber = Number(trimmedSearch.replace(/^QTN-/i, ""));

      if (Number.isInteger(quotationNumber)) {
        searchConditions.push({
          quotationNo: quotationNumber,
        });
      }

      filter.$or = searchConditions;
    }

    /* =========================
       STATUS FILTER
    ========================= */

    const allowedStatuses = ["draft", "approved", "rejected"];

    if (status && allowedStatuses.includes(status)) {
      filter.status = status;
    }

    /* =========================
       DATE FILTER
    ========================= */

    const now = new Date();
    let startDate;
    let endDate;

    if (period === "this-month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);

      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );
    }

    if (period === "last-month") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
    }

    if (period === "this-year") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear() + 1, 0, 1);
    }

    if (period === "last-year") {
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear(), 0, 1);
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    /* =========================
       DATABASE QUERY
    ========================= */

    const [totalItems, quotations] = await Promise.all([
      quotationModel.countDocuments(filter),

      quotationModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      success: true,
      message: "Quotations fetched successfully",
      data: quotations,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        limit,
      },
    });
  } catch (error) {
    console.error("Get all quotations error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getQuotationById = async (req, res) => {
    try {
        const { quotation_id } = req.body;

        if (!quotation_id) {
            return res.status(400).json({
                message: "quotation id is required"
            })
        }
        if (!mongoose.Types.ObjectId.isValid(quotation_id)) {
            return res.status(400).json({
                message: "Invalid Quotation ID"
            });
        }
        const quotation = await quotationModel.findById(quotation_id);

        const quotationItems = await quotationItemModel.find({quotation_id: quotation_id});

        if (!quotation) {
            return res.status(404).json({
                message: "quotation not found"
            })
        }
        return res.status(200).json({
            message: "Quotation fetched successfully",
            data: quotation,
            items: quotationItems
        })
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

const deleteQuotation = async (req, res) => {
    try {
        const { quotation_id } = req.body
        if (!mongoose.Types.ObjectId.isValid(quotation_id)) {
            return res.status(400).json({
                message: "Invalid Quotation ID"
            });
        }

        if (!quotation_id) {
            return res.status(400).json({
                message: "Quotation id is required"
            })
        }

        const quotation = await quotationModel.findByIdAndDelete(quotation_id);

        if (!quotation) {
            return res.status(404).json({
                message: "Quotation not found."
            })
        }

        const quotationItems = await quotationItemModel.deleteMany({ quotation_id })

        return res.status(200).json({
            message: "quotation deleted successfully",
            data: quotation,
            items: quotationItems

        })
    } catch (err) {
        console.log(err)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}





module.exports = {
    createQuotation,
    updateQuotation,
    getAllQuotations,
    getQuotationById,
    deleteQuotation,
 
}