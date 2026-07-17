const companySettingModel = require("../models/CompanySettings");
const path = require("path");
const fs = require("fs");



const createCompanySetting = async (req,res) => {
    try {
        const {admin_id,company_name,address,city,state,contact,alternative_contact,website,terms_conditions,signature,GST} = req.body

        if(!admin_id || !company_name  || !address || !city || !state || !contact || !GST ){
            return res.status(400).json({
                message: "Admin ID, company name, logo, address, city, state, contact number, and GST are required."
            })
        }

        const company_logo = req.file
  ? `/uploads/${req.file.filename}`
  : null;

        const existingCompanySettings = await companySettingModel.findOne({admin_id})
        if(existingCompanySettings){
            return res.status(409).json({
                message:"Company settings have already been created."
            })
        }
        const  companySettings = await companySettingModel.create({
            admin_id,
            company_name,
            company_logo,
            address,
            city,
            state,
            contact,
            alternative_contact,
            website,
            terms_conditions,
            signature,
            GST
        })

        return res.status(201).json({
            message:"Settings Successfully created",
            data:companySettings
        })

    }catch (err) {
    console.log(err);

    return res.status(500).json({
        message: err.message,
        error: err
    });
}
}

const updateCompanySetting = async (req,res) => {
    try{

        const {company_id,admin_id,company_name,address,city,state,contact,alternative_contact,website,terms_conditions,signature,GST} = req.body

        if(!company_id || !admin_id || !company_name || !address || !city || !state || !contact || !GST ){
            return res.status(400).json({
                message: "Company ID, Admin ID, company name, company logo, address, city, state, contact number, and GST are required."
            })
        }
        const existingCompanySettings = await companySettingModel.findById(company_id);

        if(!existingCompanySettings){
            return res.status(404).json({
                message:"Company settings not found"
            })
        }

        let company_logo = existingCompanySettings.company_logo;
        if(req.files?.company_logo?.[0]){
            const oldPath = path.join(process.cwd(), existingCompanySettings.company_logo.replace(/^\/+/, ""));

            if(existingCompanySettings.company_logo && fs.existsSync(oldPath))
            {
                fs.unlinkSync(oldPath)
            }
            company_logo = req.files.company_logo[0].filename
        }
       
const updatedCompanySetting = await companySettingModel.findByIdAndUpdate(
  company_id,
  {
    admin_id,
    company_name,
    company_logo,
    address,
    city,
    state,
    contact,
    alternative_contact,
    website,
    terms_conditions,
    signature,
    GST,
  },
  { new: true }
);

        if (!updatedCompanySetting) {
        return res.status(404).json({
            message: "Company settings not found",
        });
}   

        return res.status(200).json({
            message:"Company settings updated successfully",
            data:updatedCompanySetting
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

const getCompanySetting = async(req,res) => {
    try{
        const {admin_id} = req.body;

        if(!admin_id){
            return res.status(400).json({
                message:"admin id required"
            })
        }
        const adminSettings = await companySettingModel.findOne({admin_id})

        if(!adminSettings){
            return res.status(404).json({
                message:"company settings not found"
            })
        }
        return res.status(200).json({
            message:"Company settings fetched successfully",
            data:adminSettings
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

module.exports = {
    updateCompanySetting,
    createCompanySetting, 
    getCompanySetting
}

