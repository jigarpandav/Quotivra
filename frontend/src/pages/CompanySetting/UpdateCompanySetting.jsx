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
import { useNavigate, useParams } from "react-router-dom";
import "./UpdateCompanySetting.css";

const UpdateCompanySetting = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const { id } = useParams();

  const Adminid = localStorage.getItem("admin_id");
  const BASE_URL = import.meta.env.VITE_LOGO_URL;

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState({});

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

  const revokeBlobUrl = (url) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  const handlegetCompanySettings = async () => {
    try {
      const res = await api.post("/company-settings", {
        admin_id: Adminid,
      });

      if (res.status === 200) {
        const companySettings = res.data.data;

        const logoUrl = companySettings.company_logo
          ? `${BASE_URL}${companySettings.company_logo}`
          : "";

        const data = {
          companyName: companySettings.company_name || "",
          GST: companySettings.GST || "",
          address: companySettings.address || "",
          city: companySettings.city || "",
          state: companySettings.state || "",
          contact: companySettings.contact || "",
          alternativeContact: companySettings.alternative_contact || "",
          website: companySettings.website || "",
          terms_conditions: companySettings.terms_conditions || "",
          signature: companySettings.signature || "",
          logoPreview: logoUrl,
        };

        setInitialData(data);
        setCompanyName(data.companyName);
        setGST(data.GST);
        setAddress(data.address);
        setCity(data.city);
        setState(data.state);
        setContact(data.contact);
        setAlternativeContact(data.alternativeContact);
        setWebsite(data.website);
        setTermsConditions(data.terms_conditions);
        setSignature(data.signature);
        setLogoPreview(data.logoPreview);
        setCompanyLogo(null);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load company settings"
      );
    }
  };

  useEffect(() => {
    handlegetCompanySettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setCompanyLogo(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError((prev) => ({
        ...prev,
        company_logo: "Please select a valid image file",
      }));
      setCompanyLogo(null);
      e.target.value = "";
      return;
    }

    revokeBlobUrl(logoPreview);

    const previewUrl = URL.createObjectURL(file);

    setError((prev) => ({
      ...prev,
      company_logo: "",
    }));

    setCompanyLogo(file);
    setLogoPreview(previewUrl);
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
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        GST
      )
    ) {
      newError.GST = "Invalid GST number";
    }

    if (!address.trim()) {
      newError.address = "Address is required";
    } else if (address.trim().length < 5) {
      newError.address = "Address must be at least 5 characters";
    }

    if (!city.trim()) newError.city = "City is required";
    if (!state.trim()) newError.state = "State is required";

    if (!contact) {
      newError.contact = "Contact number is required";
    } else if (!/^[6-9]\d{9}$/.test(contact)) {
      newError.contact = "Please enter a valid 10-digit Indian mobile number";
    }

    if (alternativeContact && !/^[6-9]\d{9}$/.test(alternativeContact)) {
      newError.alternativeContact =
        "Please enter a valid alternative mobile number";
    }

    if (!company_logo && !logoPreview) {
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
      formData.append("company_id", id);
      formData.append("admin_id", Adminid);
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

      if (company_logo) {
        formData.append("company_logo", company_logo);
      }

      const res = await api.put("/company-settings/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message || "Company setting updated successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update company setting"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    revokeBlobUrl(logoPreview);

    setCompanyName(initialData.companyName || "");
    setGST(initialData.GST || "");
    setAddress(initialData.address || "");
    setCity(initialData.city || "");
    setState(initialData.state || "");
    setContact(initialData.contact || "");
    setAlternativeContact(initialData.alternativeContact || "");
    setWebsite(initialData.website || "");
    setTermsConditions(initialData.terms_conditions || "");
    setSignature(initialData.signature || "");

    setCompanyLogo(null);
    setLogoPreview(initialData.logoPreview || "");
    setError({});

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    toast.info("Form reset successfully");
  };

  return (
    <div className="update-company-setting-page page">
      <div className="container">
        <div className="update-company-setting-header">
          <div>
            <h1 className="page-title">Update Company Setting</h1>
            <p className="page-subtitle">
              Update company details used in quotation PDF.
            </p>
          </div>
        </div>

        <form className="update-company-setting-form" onSubmit={handleSave}>
          <div className="update-company-setting-card card">
            <h2>
              <FaBuilding /> Company Information
            </h2>

            <div className="update-company-setting-grid">
              <div className="form-group">
                <label>Company Name *</label>
                <div className="update-company-setting-input">
                  <FaBuilding />
                  <input
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
                <div className="update-company-setting-input">
                  <FaIdCard />
                  <input
                    value={GST}
                    onChange={(e) => setGST(e.target.value.toUpperCase())}
                    placeholder="Enter GST number"
                  />
                </div>
                {error.GST && <span className="error">{error.GST}</span>}
              </div>

              <div className="form-group">
                <label>City *</label>
                <div className="update-company-setting-input">
                  <FaCity />
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                {error.city && <span className="error">{error.city}</span>}
              </div>

              <div className="form-group">
                <label>State *</label>
                <div className="update-company-setting-input">
                  <FaMapMarkerAlt />
                  <input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
                {error.state && <span className="error">{error.state}</span>}
              </div>

              <div className="form-group update-company-setting-full-width">
                <label>Address *</label>
                <textarea
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

          <div className="update-company-setting-card card">
            <h2>
              <FaPhone /> Contact Information
            </h2>

            <div className="update-company-setting-grid">
              <div className="form-group">
                <label>Contact Number *</label>
                <div className="update-company-setting-input">
                  <FaPhone />
                  <input
                    type="tel"
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
                <div className="update-company-setting-input">
                  <FaPhone />
                  <input
                    type="tel"
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
                <div className="update-company-setting-input">
                  <FaGlobe />
                  <input
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

          <div className="update-company-setting-card card">
            <h2>
              <FaFileSignature /> Quotation Details
            </h2>

            <div className="update-company-setting-grid">
              <div className="form-group update-company-setting-full-width">
                <label>Terms & Conditions</label>
                <textarea
                  value={terms_conditions}
                  onChange={(e) => setTermsConditions(e.target.value)}
                  placeholder="Enter terms and conditions"
                  rows="5"
                />
                {error.terms_conditions && (
                  <span className="error">{error.terms_conditions}</span>
                )}
              </div>

              <div className="form-group update-company-setting-full-width">
                <label>Signature</label>
                <div className="update-company-setting-input">
                  <FaFileSignature />
                  <input
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Enter signature"
                  />
                </div>
                {error.signature && (
                  <span className="error">{error.signature}</span>
                )}
              </div>

              <div className="form-group">
                <label>Company Logo *</label>
                <div className="update-company-setting-input">
                  <FaFileSignature />
                  <input
                    ref={fileRef}
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
                <div className="update-company-setting-logo-preview">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Company logo preview" />
                  ) : (
                    <div className="update-company-setting-logo-placeholder">
                      <FaBuilding />
                      <span>No logo selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="update-company-setting-action-card card">
            <button
              type="button"
              className="btn update-company-setting-reset-btn"
              onClick={handleReset}
              disabled={loading}
            >
              <FaUndo /> Reset
            </button>

            <button
              type="submit"
              className="btn update-company-setting-save-btn"
              disabled={loading}
            >
              <FaSave />
              {loading ? "Saving..." : "Update Setting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCompanySetting;