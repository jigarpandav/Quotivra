import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import "./Login.css";
import api from "../../axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const newError = {};

    if (!email) {
      newError.email = "Email is required";
    } else if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      newError.email = "Invalid email format";
    }
    if (!password) {
      newError.password = "Password is required";
    }
    setError(newError);

    if (Object.keys(newError).length > 0) return;

    try {
      setLoading(true);

      const res = await api.post("/admin/login", {
        email, password
      });

      if (res.status === 200 && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("admin_id", res.data.admin_id);
        toast.success(res.data.message || "Login successful");
        navigate("/dashboard");
      } else {
        toast.error(res.data.message || "Invalid email or password");
        setError({ general: "Invalid email or password" });
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
      setError({ general: "Invalid email or password" });
    } finally {
      setLoading(false);
    }

  }


  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Quotivra</h1>
          <p>Smart Quotation Management System</p>
        </div>
        {error.general && <div className="auth-error">{error.general}</div>}
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-field">
            <div className={`auth-input-group ${error.email ? "input-error" : ""}`}>
              <FaEnvelope />
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error.password && <span className="error">{error.password}</span>}
          </div>
          <div className="text-right text-sm hover:text-blue-500"><Link to="/forgot-password">Forgot Password?</Link></div>

          <button type="submit" className="auth-btn" disabled={loading}>
            <FaSignInAlt />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
