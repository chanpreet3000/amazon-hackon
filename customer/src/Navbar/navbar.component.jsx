import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { axiosInstance } from "../axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Cookies from "js-cookie";

const Navbar = () => {
  const navRef = useRef();
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const popUpRef = useRef(null);
  const [accountPopoutVisible, setAccountPopoutVisible] = useState(false);

  const toggleNavbar = () => {
    navRef.current.classList.toggle("responsive");
  };

  const handlerUserSignOut = () => {
    Cookies.remove("customerToken", { path: "/" });
    navigate(`/login`);
  };

  const handleDocumentClick = (event) => {
    if (accountPopoutVisible && popUpRef.current && !popUpRef.current.contains(event.target)) {
      setAccountPopoutVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/customer/dashboard");
        setUserData(response.data.user_data);
      } catch (err) {
        setUserData(null);
      }
    };

    fetchData();
  }, [location]);
  return (
    <>
      <nav className="homepage__nav" ref={navRef}>
        <div className="homepage__nav-wrapper">
          <div className="homepage__nav-brand">
            <Link to={"/"}>
              <img src="https://upload.wikimedia.org/wikipedia/donate/thumb/f/fd/Amazon-logo-white.svg/2560px-Amazon-logo-white.svg.png" />
            </Link>
          </div>

          <div className="homepage__nav-search-container">
            <input
              type="text"
              placeholder="Search Amazon.in"
              className="homepage__nav-search-input"
            />
            <SearchIcon />
          </div>

          <div className="homepage__nav-btn-wrapper">
            {userData === null && (
              <>
                <Link to="/login">
                  <button className="homepage__nav-login-btn">Login</button>
                </Link>
                <Link to="/signup">
                  <button className="homepage__nav-signup-btn">Get Started</button>
                </Link>
              </>
            )}
            <div className="navbar-close" onClick={toggleNavbar}>
              <CloseIcon />
            </div>
            {userData !== null && (
              <div
                className="dashboard__top-nav-menu-profile-card"
                ref={popUpRef}
                onClick={(event) => {
                  event.stopPropagation();
                  setAccountPopoutVisible(!accountPopoutVisible);
                }}
              >
                <div className="dashboard__top-nav-menu-profile-card-photo">
                  <AccountCircleIcon style={{ fontSize: "40px", color: "white" }} />
                </div>
                {accountPopoutVisible && (
                  <div className="dashboard_profile-popout">
                    <div className="dashboard__top-nav-menu-profile-card-name">
                      {userData?.name?.firstName + " " + userData?.name?.lastName}
                    </div>
                    <Link to="/products" className="dashboard_profile-popout-item">
                      Shop Products
                    </Link>
                    <Link to="/order_history" className="dashboard_profile-popout-item">
                      Order History
                    </Link>
                    <Link to="#" className="dashboard_profile-popout-item">
                      Report a bug
                    </Link>
                    <button className="dashboard_profile-logout-btn" onClick={handlerUserSignOut}>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="navbar-menu" onClick={toggleNavbar}>
            <MenuIcon />
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};
export default Navbar;
