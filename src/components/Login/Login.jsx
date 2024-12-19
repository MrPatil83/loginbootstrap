import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { HiOutlineRefresh } from "react-icons/hi";

export default function Login() {
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userCaptcha, setUserCaptcha] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(true);

  const navigate = useNavigate();

  function generateCaptcha() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      // console.log(captcha);
    }
    return captcha;
  }

  // Handle captcha refresh
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setUserCaptcha("");
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields and captcha
    if (email && password && userCaptcha === captcha) {
      setIsFormValid(true);
      navigate("/"); // Redirect to Home page
    } else {
      setIsFormValid(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="form1Example1">
            Email address
          </label>
          <input
            type="email"
            id="form1Example1"
            className="form-control"
            style={{ width: "800px", height: "35px" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="form1Example2">
            Password
          </label>
          <input
            type="password"
            id="form1Example2"
            className="form-control"
            style={{ width: "800px", height: "35px" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-outline mb-4">
          <label
            className="form-label"
            htmlFor="captchaInput"
            style={{ fontSize: 18 }}
          >
            Enter Captcha:{" "}
            <HiOutlineRefresh
              onClick={refreshCaptcha}
              style={{ fontSize: 22 }}
            />
            <h5 style={{ color: "red", fontSize: 25 }}>{captcha}</h5>
          </label>
          <input
            type="text"
            id="captchaInput"
            className="form-control"
            style={{ width: "800px", height: "35px", marginBottom: 10 }}
            value={userCaptcha}
            onChange={(e) => setUserCaptcha(e.target.value)}
          />
        </div>

        {!isFormValid && (
          <div className="alert alert-danger" role="alert">
            Please fill in all details correctly and solve the captcha.
          </div>
        )}

        <button
          data-mdb-ripple-init
          type="submit"
          className="btn btn-primary btn-block"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
