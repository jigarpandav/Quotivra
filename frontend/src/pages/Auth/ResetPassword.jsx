import { useState } from "react";
import { FaLock, FaKey, FaCheckCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import "./ResetPassword.css";
import { toast } from "react-toastify";
import api from "../../axios";

const ResetPassword = () => {

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {token} = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      return setError("Password must contain at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return setError("New password and confirm password do not match");
    }

    try {
      setLoading(true);

      // Add your reset-password API call here.

     const response = await api.post(`/admin/reset-password/${token}`,{
        newPassword
      })

      if(response.status === 200){
          toast.success("Password reset successfully. You can now log in with your new password.");
    } 
  }catch (err) {
      setError(
        err.response?.data?.message || "Unable to reset your password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <div className="reset-password-icon">
          <FaKey />
        </div>

        <div className="reset-password-header">
          <h1>Reset Password</h1>

          <p>
            Create a secure new password for your Quotivra account.
          </p>
        </div>

        {error && (
          <div className="reset-password-error">
            {error}
          </div>
        )}

        <form
          className="reset-password-form"
  
        >
          <div className="form-group">
            <label htmlFor="newPassword">
              New Password
            </label>

            <div className="reset-password-input">
              <FaLock />

              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="reset-password-input">
              <FaCheckCircle />

              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <p className="reset-password-hint">
            Use at least 6 characters and choose a password that is
            difficult to guess.
          </p>

          <button
            type="button"
            className="reset-password-button"
            disabled={loading}
            onClick={handleSubmit}
          >
            <FaKey />

            {loading
              ? "Resetting Password..."
              : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;