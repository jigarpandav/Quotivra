const mongoose = require("mongoose");
const quotationModel = require("../models/Quotation");

const getDashboardData = async (req, res) => {
  try {
    const { admin_id } = req.body;

    if (!admin_id) {
      return res.status(400).json({
        success: false,
        message: "Admin id is required",
      });
    }

    const adminObjectId = new mongoose.Types.ObjectId(admin_id);

    const [
      totalQuotations,
      totalApprovedQuotations,
      totalDraftQuotations,
      totalRejectedQuotations,
      totalRevenue,
      monthlyRevenue,
      recentQuotations,
    ] = await Promise.all([
      quotationModel.countDocuments({ admin_id }),

      quotationModel.countDocuments({
        admin_id,
        status: "approved",
      }),

      quotationModel.countDocuments({
        admin_id,
        status: "draft",
      }),

      quotationModel.countDocuments({
        admin_id,
        status: "rejected",
      }),

      quotationModel.aggregate([
        {
          $match: {
            admin_id: adminObjectId,
            status: "approved",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$total_amount" },
          },
        },
      ]),

      quotationModel.aggregate([
        {
          $match: {
            admin_id: adminObjectId,
            status: "approved",
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$quotation_date" },
              month: { $month: "$quotation_date" },
            },
            revenue: { $sum: "$total_amount" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]),

      quotationModel
        .find({ admin_id })
        .sort({ quotation_date: -1 })
        .limit(5),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalQuotations,
        totalApprovedQuotations,
        totalDraftQuotations,
        totalRejectedQuotations,
        totalRevenue:
          totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0,
        monthlyRevenue,
        recentQuotations,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getDashboardData,
};