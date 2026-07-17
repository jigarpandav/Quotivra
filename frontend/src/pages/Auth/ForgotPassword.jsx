import React, { useState } from "react";
import { FaEnvelope, FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import api from "../../axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({});

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(email);
//   };

  const handleSubmit = () => {
    const newError = {};

    if(!email){
        newError.email = "Email is required";
    }
    if(email && !/^\S+@\S+\.\S+$/.test(email)){
        newError.email = "Invalid email format";
    }

    if(Object.keys(newError).length > 0){
        setError(newError);
        return;
    }

        api.post("/admin/forgot-password",{email}).then((res) => {
            if(res.status === 200){
                toast.success(res.data.message || "Password reset link sent to your email");
            }else{
                toast.error(res.data.message || "Error sending password reset link");
            }
        }).catch((err) => {
            toast.error(err.response?.data?.message || "Error sending password reset link");
        })
  }
  

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <div className="forgot-password-icon">
          <FaEnvelope />
        </div>

        <h1>Forgot Password?</h1>
        <p>
          Enter your registered email address and we will send you password reset
          instructions.
        </p>

        <form  className="forgot-password-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="forgot-input-box">
              <FaEnvelope />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error.email && <p className="form-error">{error.email}</p>}
          </div>

          <button type="button" className="forgot-submit-btn" onClick={handleSubmit}>
            <FaPaperPlane />
            Send Reset Link
          </button>
        </form>

        <Link to="/" className="forgot-back-link">
          <FaArrowLeft />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
