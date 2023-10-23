import React, { useEffect, useState } from "react";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField/input_field";
import { axiosInstance } from "../axios";
import { useLocation } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const success = location.state?.success || false;

  useEffect(() => {
    document.title = "Amazon Login";
  }, []);

  const handleForm = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const validateInput = () => {
    setErrorMessage("");
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email) === false) {
      setErrorMessage("Please enter valid details!");
      return false;
    }
    return true;
  };

  const loginUser = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    setErrorMessage("");
    setDisabled(true);
    //
    await axiosInstance
      .post("/api/customer/user/login", {
        email: form.email,
        password: form.password,
      })
      .then((response) => {
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(error?.response?.data);
      })
      .finally(() => {
        setDisabled(false);
      });
  };

  return (
    <>
      <form onSubmit={loginUser}>
        <div className="login-form__wrapper">
          <div className="login__background"></div>
          <div className="login__container">
            <div className="login-form">
              {success && <p className="success_message">Account created successfully! You can now log in.</p>}
              <h1 className="login__form-title">Hi There!</h1>
              <h3>Welcome Back</h3>
              <div className="login-form_inputs">
                <InputField
                  label="Email"
                  id="email"
                  type="email"
                  placeholder="johndoe@gmail.com"
                  onChange={handleForm}
                />
                <InputField
                  label="Password"
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  onChange={handleForm}
                />
                <div className="login-form__forgot-password-label">Forgot password?</div>
                <div className="error_message">{errorMessage}</div>
                <input type="submit" className="standard_btn" value="Log In" disabled={disabled} />
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  Don't have an account?{" "}
                  <Link
                    to={"/signup"}
                    style={{
                      textDecoration: "none",
                      color: "rgb(0, 102, 255)",
                      fontWeight: "bold",
                    }}
                    replace={true}
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;
