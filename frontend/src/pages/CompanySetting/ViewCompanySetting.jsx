import React from "react";
import "./ViewCompanySetting.css";
import {
  FaBuilding,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFileAlt,
  FaSignature,
  FaEye,
  FaExternalLinkAlt,
  FaEdit,
  FaArrowLeft,
} from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import api from "../../axios";
import  formatDate  from "../../utils/formatDate";

const ViewCompanySetting = () => {
    const navigate = useNavigate();
    const Adminid = localStorage.getItem("admin_id");
    const [company, setCompany] = React.useState({});
    const [admin, setAdmin] = React.useState({});

    const BASE_URL = import.meta.env.VITE_LOGO_URL;

    const handlegetCompanySettings = () => {
        api.post("/company-settings",{
            admin_id: Adminid
    }).then((res) => {
        if(res.status === 200){
            const json = res.data
            const companySettings = json.data
            console.log("Company Settings:", companySettings);
           setCompany(companySettings)
        }
    })
}
const handleAdmin = () => {
    api.post("/admin", {
        admin_id: Adminid
    }).then((res) => {
        if(res.status === 200){
            const json = res.data
            const admin = json.data
            setAdmin(admin)
          
        }
    })
}

React.useEffect(() => {
    handlegetCompanySettings();
    handleAdmin();
},[Adminid]);

function handleUpdateCompanySettings(companyId) {
    navigate(`/company-settings/${companyId}`);
  }

  const comp = {
    company_name: company.company_name,
    company_logo:`${BASE_URL}${company.company_logo}`,
    GST: company.GST,
    website: company.website,
    contact: company.contact,
    alternative_contact: company.alternative_contact || "-",
    address: company.address,
    city: company.city,
    state: company.state,
    terms_conditions: company.terms_conditions ||
      "The prices mentioned in this quotation are valid for 15 days from the date of issue. Taxes, if applicable, will be charged extra. Goods will be supplied subject to product availability and the agreed payment terms.",
    signature: company.signature || admin.name,
  };

  return (
    <div className="page company-view-page">
      <div className="container">
        <div className="company-view-top">
          <div>
            <h1 className="page-title">Company Settings</h1>
            <p className="page-subtitle">View and manage your company details</p>
          </div>

          <div className="company-breadcrumb">
            <span onClick={() => navigate("/dashboard")}>Dashboard</span>
            <span>›</span>
            
           
            <span className="active">Company Settings</span>
          </div>
        </div>

        <div className="company-view-card card">
          <div className="company-section-title">
            <FaBuilding />
            <h3>Company Profile</h3>
          </div>

          <div className="company-profile-grid">
            <div className="company-logo-box">
              <img src={comp.company_logo} alt="Company Logo" />
              {/* <button className="view-logo-btn">
                <FaEye /> View Logo
              </button> */}
            </div>

            <div className="company-info-grid">
              <div className="company-info-item">
                <span>Company Name</span>
                <h4>{comp.company_name}</h4>
              </div>

              <div className="company-info-item">
                <span>GST Number</span>
                <h4>{comp.GST}</h4>
              </div>

              <div className="company-info-item">
                <span>Website</span>
                <a href={comp.website} target="_blank">
                  {comp.website} <FaExternalLinkAlt />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="company-view-card card">
          <div className="company-section-title">
            <FaPhoneAlt />
            <h3>Contact Information</h3>
          </div>

          <div className="company-two-grid">
            <div className="company-info-item">
              <span>Primary Contact</span>
              <h4><FaPhoneAlt /> {comp.contact}</h4>
            </div>

            <div className="company-info-item company-border-left">
              <span>Alternative Contact</span>
              <h4><FaPhoneAlt /> {comp.alternative_contact}</h4>
            </div>
          </div>
        </div>

        <div className="company-view-card card">
          <div className="company-section-title">
            <FaMapMarkerAlt />
            <h3>Address Details</h3>
          </div>

          <div className="company-address-text">
            <span>Address</span>
            <p>{comp.address}</p>
          </div>

          <div className="company-two-grid">
            <div className="company-info-item">
              <span>City</span>
              <h4>{comp.city}</h4>
            </div>

            <div className="company-info-item company-border-left">
              <span>State</span>
              <h4>{comp.state}</h4>
            </div>
          </div>
        </div>

        <div className="company-view-card card">
          <div className="company-section-title">
            <FaFileAlt />
            <h3>Terms & Conditions</h3>
          </div>

          <div className="company-terms-box">
            {comp.terms_conditions}
          </div>
        </div>

        <div className="company-view-card card">
          <div className="company-section-title">
            <FaSignature />
            <h3>Authorized Signature</h3>
          </div>

          <div className="company-signature-row">
            <h3 className="company-signature-name">{comp.signature}</h3>
            <div>
              <span>Authorized Signature</span>
              <p>{formatDate(company.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="company-view-actions">
          <button className="btn btn-primary" onClick={() => handleUpdateCompanySettings(company._id)}>
            <FaEdit /> Edit Settings
          </button>

          <button className="btn company-back-btn" onClick={() => navigate("/change-password")}>
            <MdOutlinePassword /> Change Password
          </button>

                    <button className="btn company-back-btn" onClick={() => navigate("/dashboard")}>
            <FaArrowLeft /> Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCompanySetting;