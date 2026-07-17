import { useState } from "react";
import {
  FaUser,
  FaPhone,
  FaBox,
  FaRupeeSign,
  FaPlus,
  FaTrash,
  FaSave,
  FaUndo,
  FaHashtag,
  FaCalculator,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../axios";

import "./Quotation.css";

const Quotation = () => {
  const navigate = useNavigate();

  const initialData = {
    customer_name: "",
    customer_contact: "",
    status: "draft",
    items: [{ product_name: "", price: "", quantity: "" }],
  };

  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const admin_id = localStorage.getItem("admin_id");

  const totalQuantity = formData.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const totalAmount = formData.items.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const statusOptions = [
    {
      value: "draft",
      label: "Draft",
      icon: <FaClock />,
    },
    {
      value: "approved",
      label: "Approved",
      icon: <FaCheckCircle />,
    },
    {
      value: "rejected",
      label: "Rejected",
      icon: <FaTimesCircle />,
    },
  ];

  const validateForm = () => {
    setError("");
    const newFieldErrors = {};

    if (!admin_id) {
      setError("Admin id is missing. Please login again.");
      return false;
    }

    if (!formData.customer_name.trim()) {
      newFieldErrors.customer_name = "Customer name is required";
    }

    if (!/^[6-9]\d{9}$/.test(formData.customer_contact)) {
      newFieldErrors.customer_contact = formData.customer_contact
        ? "Enter valid 10 digit Indian contact number"
        : "Contact number is required";
    }

    if (!["draft", "approved", "rejected"].includes(formData.status)) {
      newFieldErrors.status = "Please select a valid quotation status";
    }

    if (!formData.items.length) {
      setError("At least one product is required");
      return false;
    }

    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];

      if (!item.product_name.trim()) {
        newFieldErrors[`items.${i}.product_name`] = "Product name is required";
      }

      if (!item.price || Number(item.price) <= 0) {
        newFieldErrors[`items.${i}.price`] = "Valid price is required";
      }

      if (!item.quantity || Number(item.quantity) <= 0) {
        newFieldErrors[`items.${i}.quantity`] = "Valid quantity is required";
      }
    }

    setFieldErrors(newFieldErrors);

    if (Object.keys(newFieldErrors).length > 0) {
      setError("Please fix the highlighted fields.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "customer_contact") {
      const onlyNumber = value.replace(/\D/g, "");
      if (onlyNumber.length <= 10) {
        setFormData({ ...formData, [name]: onlyNumber });
        setFieldErrors({ ...fieldErrors, [name]: "" });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;

    if ((name === "price" || name === "quantity") && Number(value) < 0) {
      return;
    }

    const updatedItems = [...formData.items];
    updatedItems[index][name] = value;

    setFormData({ ...formData, items: updatedItems });
    setFieldErrors({ ...fieldErrors, [`items.${index}.${name}`]: "" });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_name: "", price: "", quantity: "" }],
    });
    setError("");
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      setError("At least one product is required");
      return;
    }

    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
    setFieldErrors({});
    setError("");
  };

  const handleReset = () => {
    setFormData(initialData);
    setError("");
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        admin_id,
        customer_name: formData.customer_name.trim(),
        customer_contact: formData.customer_contact,
        quotation_date: new Date(),
        total_amount: totalAmount,
        status: formData.status,
        products: formData.items.map((item) => ({
          product_name: item.product_name.trim(),
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
      };

      await api.post("/quotation", payload);

      toast.success("Quotation created successfully");
      navigate("/quotations/view");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-quotation-page page">
      <div className="container">
        <div className="add-quotation-header">
          <div>
            <h1 className="page-title">Add Quotation</h1>
            <p className="page-subtitle">
              Create customer and product quotation.
            </p>
          </div>
        </div>

        {error && <div className="quotation-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="add-quotation-form">
          <div className="quotation-card card">
            <h2>Customer Details</h2>

            <div className="quotation-grid">
              <div className="form-group">
                <label>Customer Name *</label>
                <div className="quotation-input">
                  <FaUser />
                  <input
                    type="text"
                    name="customer_name"
                    placeholder="Enter customer name"
                    value={formData.customer_name}
                    onChange={handleChange}
                  />
                </div>
                {fieldErrors.customer_name && (
                  <span className="error">{fieldErrors.customer_name}</span>
                )}
              </div>

              <div className="form-group">
                <label>Contact Number *</label>
                <div className="quotation-input">
                  <FaPhone />
                  <input
                    type="text"
                    name="customer_contact"
                    placeholder="Enter contact number"
                    value={formData.customer_contact}
                    onChange={handleChange}
                  />
                </div>
                {fieldErrors.customer_contact && (
                  <span className="error">{fieldErrors.customer_contact}</span>
                )}
              </div>

              <div className="form-group">
                <label>Status</label>
                <div className="status-segment" role="radiogroup" aria-label="Quotation status">
                  {statusOptions.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      className={
                        formData.status === option.value
                          ? `status-option ${option.value} active`
                          : `status-option ${option.value}`
                      }
                      onClick={() => {
                        setFormData({ ...formData, status: option.value });
                        setFieldErrors({ ...fieldErrors, status: "" });
                      }}
                      role="radio"
                      aria-checked={formData.status === option.value}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
                {fieldErrors.status && (
                  <span className="error">{fieldErrors.status}</span>
                )}
              </div>
            </div>
          </div>

          <div className="quotation-card card">
            <div className="quotation-card-header">
              <h2>Product Details</h2>

              <button type="button" className="add-item-btn" onClick={addItem}>
                <FaPlus /> Add Product
              </button>
            </div>

            <div className="quotation-items">
              {formData.items.map((item, index) => (
                <div className="quotation-item-row" key={index}>
                  <div className="form-group">
                    <label>Product Name *</label>
                    <div className="quotation-input">
                      <FaBox />
                      <input
                        type="text"
                        name="product_name"
                        placeholder="Product name"
                        value={item.product_name}
                        onChange={(e) => handleItemChange(index, e)}
                      />
                    </div>
                    {fieldErrors[`items.${index}.product_name`] && (
                      <span className="error">
                        {fieldErrors[`items.${index}.product_name`]}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Price *</label>
                    <div className="quotation-input">
                      <FaRupeeSign />
                      <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        min="1"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, e)}
                      />
                    </div>
                    {fieldErrors[`items.${index}.price`] && (
                      <span className="error">
                        {fieldErrors[`items.${index}.price`]}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Quantity *</label>
                    <div className="quotation-input">
                      <FaHashtag />
                      <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, e)}
                      />
                    </div>
                    {fieldErrors[`items.${index}.quantity`] && (
                      <span className="error">
                        {fieldErrors[`items.${index}.quantity`]}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Total</label>
                    <div className="quotation-input quotation-total-input">
                      <FaCalculator />
                      <input
                        type="text"
                        value={
                          Number(item.price || 0) * Number(item.quantity || 0)
                        }
                        readOnly
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => removeItem(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="quotation-summary-card card">
            <div>
              <p>Total Quantity</p>
              <h3>{totalQuantity}</h3>
            </div>

            <div>
              <p>Total Amount</p>
              <h3>₹{totalAmount}</h3>
            </div>
          </div>

          <div className="quotation-action-card card">
            <button
              type="button"
              className="btn quotation-reset-btn"
              onClick={handleReset}
            >
              <FaUndo /> Reset
            </button>

            <button
              type="submit"
              className="btn quotation-save-btn"
              disabled={loading}
            >
              <FaSave />
              {loading ? "Saving..." : "Save Quotation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Quotation;
