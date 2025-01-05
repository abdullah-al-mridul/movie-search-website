import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [validationStates, setValidationStates] = useState({
    email: null,
    password: null,
  });
  const { login } = useAuth();

  const validateEmail = (email) => {
    return email === "admin";
  };

  const validatePassword = (password) => {
    return password === "123456";
  };

  const handleInputChange = (field, value) => {
    if (field === "email") {
      setEmail(value);
      if (value) {
        setValidationStates((prev) => ({
          ...prev,
          email: validateEmail(value),
        }));
      } else {
        setValidationStates((prev) => ({
          ...prev,
          email: null,
        }));
      }
    } else {
      setPassword(value);
      if (value) {
        setValidationStates((prev) => ({
          ...prev,
          password: validatePassword(value),
        }));
      } else {
        setValidationStates((prev) => ({
          ...prev,
          password: null,
        }));
      }
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!email || !password) {
      setError("Please fill in all fields");
      animateShake();
      return;
    }

    const isSuccess = login(email, password);

    if (!isSuccess) {
      setError("Invalid credentials");
      animateShake();
      form.classList.add("login-error-animation");
    } else {
      form.classList.add("login-success-animation");
    }
  };

  const animateShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className="login-container">
      <form
        onSubmit={handleSubmit}
        className={`login-form ${isShaking ? "shake" : ""}`}
      >
        <div className="login-logo">
          <svg
            className="logo-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M15 12L10 15V9L15 12Z" fill="currentColor" />
          </svg>
        </div>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">
          Enter your credentials to access your account
        </p>
        {error && <div className="login-error">{error}</div>}
        <div className="login-input-group">
          <label className="login-label">Email</label>
          <div
            className={`login-input-wrapper ${
              validationStates.email !== null
                ? validationStates.email
                  ? "valid"
                  : "invalid"
                : ""
            }`}
          >
            <input
              type="text"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="admin"
              className="login-input"
            />
            {validationStates.email !== null && (
              <span className="validation-icon">
                {validationStates.email ? "✓" : "✕"}
              </span>
            )}
          </div>
        </div>
        <div className="login-input-group">
          <label className="login-label">Password</label>
          <div
            className={`login-input-wrapper ${
              validationStates.password !== null
                ? validationStates.password
                  ? "valid"
                  : "invalid"
                : ""
            }`}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="123456"
              className="login-input"
            />
            {validationStates.password !== null && (
              <span className="validation-icon">
                {validationStates.password ? "✓" : "✕"}
              </span>
            )}
          </div>
        </div>
        <button type="submit" className="login-button">
          Sign In
        </button>
        <div className="login-credits">
          <p>
            Developed by{" "}
            <a
              href="https://github.com/abdullah-al-mridul"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abdullah Al Mridul
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
