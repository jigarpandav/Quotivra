import { useEffect, useRef, useState } from "react";
import {
  FaBuilding,
  FaPhone,
  FaGlobe,
  FaMapMarkerAlt,
  FaCity,
  FaFileSignature,
  FaSave,
  FaUndo,
  FaIdCard,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../axios";
import { useNavigate } from "react-router-dom";
import "./CompanySetting.css";

const CompanySetting = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [GST, setGST] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [contact, setContact] = useState("");
  const [alternativeContact, setAlternativeContact] = useState("");
  const [website, setWebsite] = useState("");
  const [terms_conditions, setTermsConditions] = useState("");
  const [signature, setSignature] = useState("");
  const [company_logo, setCompanyLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const Adminid = localStorage.getItem("admin_id");

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setCompanyLogo(null);
      setLogoPreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError({ ...error, company_logo: "Please select a valid image file" });
      setCompanyLogo(null);
      setLogoPreview("");
      e.target.value = "";
      return;
    }

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setError({ ...error, company_logo: "" });
    setCompanyLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const newError = {};

    if (!companyName.trim()) {
      newError.companyName = "Company name is required";
    } else if (companyName.trim().length < 3) {
      newError.companyName = "Company name must be at least 3 characters";
    }

    if (
      GST &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(GST)
    ) {
      newError.GST = "Invalid GST number";
    }

    if (!address.trim()) {
      newError.address = "Address is required";
    } else if (address.trim().length < 5) {
      newError.address = "Address must be at least 5 characters";
    }

    if (!city.trim()) {
      newError.city = "City is required";
    }

    if (!state.trim()) {
      newError.state = "State is required";
    }

    if (!contact) {
      newError.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(contact)) {
      newError.contact = "Contact number must be 10 digits";
    } else if (!/^[6-9]\d{9}$/.test(contact)) {
      newError.contact = "Contact number must start with 6, 7, 8, or 9";
    }

    if (alternativeContact && !/^\d{10}$/.test(alternativeContact)) {
      newError.alternativeContact =
        "Alternative contact number must be 10 digits";
    }
    if(!company_logo){
      newError.company_logo = "Company logo is required";
    }

    if (website && !/^https?:\/\/\S+\.\S+$/.test(website)) {
      newError.website = "Website must be a valid URL";
    }

    if (terms_conditions && terms_conditions.trim().length < 10) {
      newError.terms_conditions =
        "Terms and conditions must be at least 10 characters";
    }

    if (signature && signature.trim().length < 3) {
      newError.signature = "Signature must be at least 3 characters";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("company_name", companyName);
      formData.append("GST", GST);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("contact", contact);
      formData.append("alternative_contact", alternativeContact);
      formData.append("website", website);
      formData.append("terms_conditions", terms_conditions);
      formData.append("signature", signature);
      formData.append("admin_id", Adminid);

      if (company_logo) {
        formData.append("company_logo", company_logo);
      }

      const res = await api.post("/company-setting", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status >= 200 && res.status < 300) {
        toast.success(res.data.message || "Company setting saved successfully");
        navigate("/dashboard");
      } else {
        toast.error(res.data.message || "Failed to save company setting");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save company setting"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCompanyName("");
    setGST("");
    setAddress("");
    setCity("");
    setState("");
    setContact("");
    setAlternativeContact("");
    setWebsite("");
    setTermsConditions("");
    setSignature("");
    setCompanyLogo(null);
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview("");
    setError({});

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <div className="company-setting-page page">
      <div className="container">
        <div className="company-setting-header">
          <div>
            <h1 className="page-title">Company Setting</h1>
            <p className="page-subtitle">
              Manage company details used in quotation PDF.
            </p>
          </div>
        </div>

        <form className="company-setting-form" >
          <div className="company-setting-card card">
            <h2>
              <FaBuilding /> Company Information
            </h2>

            <div className="company-grid">
              <div className="form-group">
                <label>Company Name *</label>
                <div className="company-input">
                  <FaBuilding />
                  <input
                    name="company_name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
                {error.companyName && (
                  <span className="error">{error.companyName}</span>
                )}
              </div>

              <div className="form-group">
                <label>GST Number</label>
                <div className="company-input">
                  <FaIdCard />
                  <input
                    name="GST"
                    value={GST}
                    onChange={(e) => setGST(e.target.value.toUpperCase())}
                    placeholder="Enter GST number"
                  />
                </div>
                {error.GST && <span className="error">{error.GST}</span>}
              </div>

              <div className="form-group">
                <label>City *</label>
                <div className="company-input">
                  <FaCity />
                  <input
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                {error.city && <span className="error">{error.city}</span>}
              </div>

              <div className="form-group">
                <label>State *</label>
                <div className="company-input">
                  <FaMapMarkerAlt />
                  <input
                    name="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
                {error.state && <span className="error">{error.state}</span>}
              </div>

              <div className="form-group full-width">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter company address"
                  rows="4"
                />
                {error.address && (
                  <span className="error">{error.address}</span>
                )}
              </div>
            </div>
          </div>

          <div className="company-setting-card card">
            <h2>
              <FaPhone /> Contact Information
            </h2>

            <div className="company-grid">
              <div className="form-group">
                <label>Contact Number *</label>
                <div className="company-input">
                  <FaPhone />
                  <input
                    type="tel"
                    name="contact"
                    maxLength={10}
                    value={contact}
                    onChange={(e) =>
                      setContact(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Enter contact number"
                  />
                </div>
                {error.contact && (
                  <span className="error">{error.contact}</span>
                )}
              </div>

              <div className="form-group">
                <label>Alternative Contact</label>
                <div className="company-input">
                  <FaPhone />
                  <input
                    type="tel"
                    name="alternative_contact"
                    maxLength={10}
                    value={alternativeContact}
                    onChange={(e) =>
                      setAlternativeContact(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Enter alternative contact"
                  />
                </div>
                {error.alternativeContact && (
                  <span className="error">{error.alternativeContact}</span>
                )}
              </div>

              <div className="form-group">
                <label>Website</label>
                <div className="company-input">
                  <FaGlobe />
                  <input
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                {error.website && (
                  <span className="error">{error.website}</span>
                )}
              </div>
            </div>
          </div>

          <div className="company-setting-card card">
            <h2>
              <FaFileSignature /> Quotation Details
            </h2>

            <div className="company-grid">
              <div className="form-group full-width">
                <label>Terms & Conditions</label>
                <textarea
                  name="terms_conditions"
                  value={terms_conditions}
                  onChange={(e) => setTermsConditions(e.target.value)}
                  placeholder="Enter terms and conditions"
                  rows="5"
                />
                {error.terms_conditions && (
                  <span className="error">{error.terms_conditions}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label>Signature</label>
                <div className="company-input">
                  <FaFileSignature />
                  <input
                    name="signature"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Enter signature"
                    type="text"
                  />
                </div>
                {error.signature && (
                  <span className="error">{error.signature}</span>
                )}
              </div>

              <div className="form-group">
                <label>Company Logo</label>
                <div className="company-input">
                  <FaFileSignature />
                  <input
                    ref={fileRef}
                    name="company_logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </div>
                {error.company_logo && (
                  <span className="error">{error.company_logo}</span>
                )}
              </div>

              <div className="form-group">
                <label>Logo Preview</label>
                <div className="company-logo-preview">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Company logo preview" />
                  ) : (
                    <div className="company-logo-placeholder">
                      <FaBuilding />
                      <span>No logo selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="company-action-card card">
            <button
              type="button"
              className="btn company-reset-btn"
              onClick={handleReset}
              disabled={loading}
            >
              <FaUndo /> Reset
            </button>

            <button
              type="button"
              className="btn company-save-btn"
              disabled={loading}
              onClick={handleSave}
            >
              <FaSave />
              {loading ? "Saving..." : "Save Setting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySetting;
