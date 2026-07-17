import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "./Register.css";
import api from "../../axios";



const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {

    e.preventDefault();
    const newError = {};

    if (!name) {
      newError.name = "Name is required";
    }
    if (name && name.trim().length < 3) {
      newError.name = "Name must be at least 3 characters";
    }
    if (!email) {
      newError.email = "Email is required";
    } else if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      newError.email = "Invalid email format";
    }
    if (!password) {
      newError.password = "Password is required";
    }
    else if (password && password.length < 6) {
      newError.password = "Password must be at least 6 characters";
    }
    else if (password && !/[A-Z]/.test(password)) {
      newError.password = "Password must contain at least one uppercase letter";
    }
    else if (password && !/[a-z]/.test(password)) {
      newError.password = "Password must contain at least one lowercase letter";
    }
    else if (password && !/[0-9]/.test(password)) {
      newError.password = "Password must contain at least one number";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) return;
    try {
      setLoading(true);

      const res = await api.post("/admin/register", {
        name, email, password
      })
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      }
      else {
        toast.error(res.data.message);
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">Q</div>
          <h1>Create Account</h1>
          <p>Start managing quotations with Quotivra</p>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="auth-field">
            <div className={`auth-input-group ${error.name ? "input-error" : ""}`}>
              <FaUser />
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {error.name && <span className="error">{error.name}</span>}
          </div>

          <div className="auth-field">
            <div className={`auth-input-group ${error.email ? "input-error" : ""}`}>
              <FaEnvelope />
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error.email && <span className="error">{error.email}</span>}
          </div>

          <div className="auth-field">
            <div className={`auth-input-group ${error.password ? "input-error" : ""}`}>
              <FaLock />
              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error.password && <span className="error">{error.password}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            <FaUserPlus />
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
