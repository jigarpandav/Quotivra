import { useState, useEffect, useCallback, useRef } from "react";
import {
  FaUser,
  FaPhone,
  FaBox,
  FaRupeeSign,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaUndo,
  FaHashtag,
  FaCalculator,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../axios";
import formatCurrency from "../../utils/formatCurrency";

import "./UpdateQuotation.css";

const emptyItem = {
  product_name: "",
  price: "",
  quantity: "",
};

const defaultFormData = {
  customer_name: "",
  customer_contact: "",
  status: "draft",
  items: [],
};

const UpdateQuotation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const admin_id = localStorage.getItem("admin_id");
  const builderSectionRef = useRef(null);

  const scrollToBuilderSection = () => {
    if (!window.matchMedia("(max-width: 576px)").matches) return;

    requestAnimationFrame(() => {
      builderSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const preserveScrollPosition = () => {
    const currentScrollY = window.scrollY;

    requestAnimationFrame(() => {
      window.scrollTo({ top: currentScrollY, behavior: "auto" });
    });
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [originalData, setOriginalData] = useState(defaultFormData);
  const [draftItem, setDraftItem] = useState(emptyItem);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const getQuotationData = useCallback(async () => {
    try {
      const res = await api.post("/quotation/id", { quotation_id: id });

      if (res.status === 200) {
        const quotation = res.data.data;
        const items = res.data.items || [];

        const updatedData = {
          customer_name: quotation.customer_name || "",
          customer_contact: quotation.customer_contact || "",
          status: quotation.status || "draft",
          items: items.length
            ? items.map((item) => ({
                product_name: item.product_name || "",
                price: item.price || "",
                quantity: item.quantity || "",
              }))
            : [{ product_name: "", price: "", quantity: "" }],
        };

        setFormData(updatedData);
        setOriginalData(updatedData);
        setDraftItem(emptyItem);
      }
    } catch {
      toast.error("Failed to fetch quotation data");
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getQuotationData();
    }, 0);

    return () => clearTimeout(timer);
  }, [getQuotationData]);

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
    { value: "draft", label: "Draft", icon: <FaClock /> },
    { value: "approved", label: "Approved", icon: <FaCheckCircle /> },
    { value: "rejected", label: "Rejected", icon: <FaTimesCircle /> },
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

    formData.items.forEach((item, index) => {
      if (!item.product_name.trim()) {
        newFieldErrors[`items.${index}.product_name`] =
          "Product name is required";
      }

      if (!item.price || Number(item.price) <= 0) {
        newFieldErrors[`items.${index}.price`] = "Valid price is required";
      }

      if (!item.quantity || Number(item.quantity) <= 0) {
        newFieldErrors[`items.${index}.quantity`] = "Valid quantity is required";
      }
    });

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

  const handleDraftItemChange = (e) => {
    const { name, value } = e.target;

    if ((name === "price" || name === "quantity") && Number(value) < 0) {
      return;
    }

    setDraftItem({ ...draftItem, [name]: value });
    setFieldErrors({ ...fieldErrors, [`draftItem.${name}`]: "" });
  };

  const addItem = () => {
    const nextFieldErrors = {};

    if (!draftItem.product_name.trim()) {
      nextFieldErrors["draftItem.product_name"] = "Product name is required";
    }

    if (!draftItem.price || Number(draftItem.price) <= 0) {
      nextFieldErrors["draftItem.price"] = "Valid price is required";
    }

    if (!draftItem.quantity || Number(draftItem.quantity) <= 0) {
      nextFieldErrors["draftItem.quantity"] = "Valid quantity is required";
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors({ ...fieldErrors, ...nextFieldErrors });
      setError("Please fix the highlighted fields.");
      return;
    }

    const nextItem = {
      product_name: draftItem.product_name.trim(),
      price: draftItem.price,
      quantity: draftItem.quantity,
    };

    const updatedItems = [...formData.items];

    if (editingItemIndex === null) {
      updatedItems.push(nextItem);
    } else {
      updatedItems[editingItemIndex] = nextItem;
    }

    setFormData({
      ...formData,
      items: updatedItems,
    });
    setDraftItem(emptyItem);
    setEditingItemIndex(null);
    setError("");
    setFieldErrors({});
    preserveScrollPosition();
  };

  const startEditItem = (index) => {
    const item = formData.items[index];

    setDraftItem({
      product_name: item.product_name,
      price: item.price,
      quantity: item.quantity,
    });
    setEditingItemIndex(index);
    setError("");
    setFieldErrors({});
    scrollToBuilderSection();
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const nextEditingIndex =
      editingItemIndex === index
        ? null
        : editingItemIndex > index
          ? editingItemIndex - 1
          : editingItemIndex;

    setFormData({ ...formData, items: updatedItems });
    setEditingItemIndex(nextEditingIndex);
    if (editingItemIndex === index) {
      setDraftItem(emptyItem);
    }
    setFieldErrors({});
    setError("");
  };

  const handleReset = () => {
    setFormData(originalData);
    setDraftItem(emptyItem);
    setEditingItemIndex(null);
    setError("");
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        quotation_id: id,
        admin_id,
        customer_name: formData.customer_name.trim(),
        customer_contact: formData.customer_contact,
        total_amount: totalAmount,
        status: formData.status,
        products: formData.items.map((item) => ({
          product_name: item.product_name.trim(),
          price: Number(item.price),
          quantity: Number(item.quantity),
          total: Number(item.price) * Number(item.quantity),
        })),
      };

      await api.put("/quotation/update", payload);

      toast.success("Quotation updated successfully");
      navigate("/quotations/view");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-quotation-page page">
      <div className="container">
        <div className="add-quotation-header">
          <div>
            <h1 className="page-title">Update Quotation</h1>
            <p className="page-subtitle">
              Update customer and product quotation.
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
                <div className="status-segment">
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

          <div
            className="quotation-card card quotation-builder-card"
            ref={builderSectionRef}
          >
            <div className="quotation-builder-header">
              <div>
                <p className="quotation-step-label">Quotation Builder</p>
                <h2>Update Product Item</h2>
                <p>Select product and add quantity to this order</p>
              </div>

              <span className="quotation-step-pill">Step 2</span>
            </div>

            <div className="quotation-builder-grid">
              <div className="form-group quotation-builder-field">
                <label>Select Product</label>
                <div className="quotation-input">
                  <FaBox />
                  <input
                    type="text"
                    name="product_name"
                    placeholder="Search product..."
                    value={draftItem.product_name}
                    onChange={handleDraftItemChange}
                  />
                </div>
                {fieldErrors["draftItem.product_name"] && (
                  <span className="error">
                    {fieldErrors["draftItem.product_name"]}
                  </span>
                )}
              </div>

              <div className="form-group quotation-builder-field">
                <label>Unit Price</label>
                <div className="quotation-input">
                  <FaRupeeSign />
                  <input
                    type="number"
                    name="price"
                    placeholder="0"
                    min="1"
                    step="0.01"
                    value={draftItem.price}
                    onChange={handleDraftItemChange}
                  />
                </div>
                {fieldErrors["draftItem.price"] && (
                  <span className="error">{fieldErrors["draftItem.price"]}</span>
                )}
              </div>

              <div className="form-group quotation-builder-field">
                <label>Quantity</label>
                <div className="quotation-input">
                  <FaHashtag />
                  <input
                    type="number"
                    name="quantity"
                    placeholder="1"
                    min="1"
                    value={draftItem.quantity}
                    onChange={handleDraftItemChange}
                  />
                </div>
                {fieldErrors["draftItem.quantity"] && (
                  <span className="error">
                    {fieldErrors["draftItem.quantity"]}
                  </span>
                )}
              </div>

              <div className="form-group quotation-builder-field">
                <label>Total</label>
                <div className="quotation-input quotation-total-input">
                  <FaCalculator />
                  <input
                    type="text"
                    value={
                      Number(draftItem.price || 0) * Number(draftItem.quantity || 0)
                    }
                    readOnly
                  />
                </div>
              </div>

              <div className="quotation-builder-actions">
                {editingItemIndex !== null && (
                  <button
                    type="button"
                    className="btn quotation-cancel-edit-btn"
                    onClick={() => {
                      setDraftItem(emptyItem);
                      setEditingItemIndex(null);
                      setFieldErrors({});
                      setError("");
                    }}
                  >
                    Cancel Edit
                  </button>
                )}

                <button type="button" className="add-item-btn" onClick={addItem}>
                  {editingItemIndex !== null ? <FaEdit /> : <FaPlus />}
                  {editingItemIndex !== null ? "Update Item" : "Add Item"}
                </button>
              </div>
            </div>
          </div>

          <div className="quotation-card card quotation-items-card">
            <div className="quotation-items-header">
              <div>
                <h2>Order Items</h2>
                <p>Review all products before submitting order</p>
              </div>

              <span className="quotation-items-count">
                {formData.items.length} Item{formData.items.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="quotation-items-table">
              <div className="quotation-table-header">
                <span>Product Name</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span>Actions</span>
              </div>

              {formData.items.length ? (
                formData.items.map((item, index) => (
                  <div className="quotation-table-row" key={`${item.product_name}-${index}`}>
                    <div className="quotation-item-label" data-label="Product Name">
                      <span className="quotation-item-name">
                        {item.product_name || "Untitled product"}
                      </span>
                    </div>

                    <div className="quotation-item-value" data-label="Price">
                      {formatCurrency(Number(item.price || 0))}
                    </div>

                    <div className="quotation-item-value" data-label="Quantity">
                      {Number(item.quantity || 0)}
                    </div>

                    <div
                      className="quotation-item-value quotation-item-total"
                      data-label="Total"
                    >
                      {formatCurrency(
                        Number(item.price || 0) * Number(item.quantity || 0)
                      )}
                    </div>

                    <div className="quotation-row-actions quotation-table-action">
                      <button
                        type="button"
                        className="edit-item-btn"
                        onClick={() => startEditItem(index)}
                        aria-label={`Edit ${item.product_name || "item"}`}
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        className="remove-item-btn"
                        onClick={() => removeItem(index)}
                        aria-label={`Remove ${item.product_name || "item"}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="quotation-empty-state">No order items</div>
              )}
            </div>
          </div>

          <div className="quotation-summary-card card">
            <div>
              <p>Total Quantity</p>
              <h3>{totalQuantity}</h3>
            </div>

            <div>
              <p>Total Amount</p>
              <h3>{formatCurrency(totalAmount)}</h3>
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
              {loading ? "Saving..." : "Update Quotation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuotation;
