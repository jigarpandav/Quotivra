import { useState } from "react";
import { FaKey, FaLock,FaArrowLeft, FaShieldAlt, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import api from "../../axios";
import "./ChangePassword.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const admin_id = localStorage.getItem("admin_id");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!admin_id) {
      return "Admin ID not found. Please login again";
    }

    if (!oldPassword.trim()) {
      return "Old password is required";
    }

    if (!newPassword.trim()) {
      return "New password is required";
    }

    if (newPassword.length < 6) {
      return "New password must be at least 6 characters";
    }

    if (oldPassword === newPassword) {
      return "New password must be different from old password";
    }

    if (!confirmPassword.trim()) {
      return "Confirm password is required";
    }

    if (newPassword !== confirmPassword) {
      return "New password and confirm password do not match";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/admin/change-password", {
        admin_id,
        oldPassword,
        newPassword,
      });

      toast.success(
        response.data?.message || "Password changed successfully"
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Unable to change password";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-card glass">
        <div className="change-password-icon">
          <FaShieldAlt />
        </div>

        <div className="change-password-header">
          <h1>Change Password</h1>

          <p>
            Update your account password to keep your Quotivra account secure.
          </p>
        </div>

        {error && (
          <div className="change-password-alert change-password-error">
            {error}
          </div>
        )}

        <form
          className="change-password-form flex flex-col gap-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-group">
            <label htmlFor="oldPassword">Old Password</label>

            <div className="change-password-input">
              <FaKey />

              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  setError("");
                }}
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>

            <div className="change-password-input">
              <FaLock />

              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>

            <div className="change-password-input">
              <FaLock />

              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                autoComplete="new-password"
              />
            </div>
          </div>

          <p className="change-password-hint">
            Use at least 6 characters. Your new password should be different
            from your old password.
          </p>

          <button
            type="submit"
            className="change-password-button w-full flex items-center justify-center gap-2"
            disabled={loading}
          >
            <FaSave />

            {loading ? "Changing Password..." : "Change Password"}
          </button>

           <button onClick = {() => navigate("/dashboard")} className="forgot-back-link">
                    <FaArrowLeft />
                    Back to Dashboard
                  </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;