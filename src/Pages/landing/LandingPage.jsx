import React, { useEffect } from "react";
import AccountsDetail from "../../Components/Accounts/AccountsDetail";
import { useLocation } from "react-router-dom";
import axios from "axios";
// ////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////
const LandingPage = () => {
  const location = useLocation();
  // Immediately check and store token on initial JS execution
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token && !sessionStorage.getItem("token")) {
    sessionStorage.setItem("token", token);
  }

  if (token) {
    // Always update sessionStorage with the latest token from the URL
    sessionStorage.setItem("token", token);
  }

  useEffect(() => {
    GetNewToken();
  }, []);

  const GetNewToken = async () => {
    try {
      const Token = sessionStorage.getItem("token");

      const response = await axios.post(
        "/sso/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      // console.log(response?.data?.token);
      sessionStorage.setItem("token", response?.data?.token);
    } catch (error) {
      console.error(error?.response);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      GetNewToken();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lg:p-5 p-3">
      <AccountsDetail />
    </div>
  );
};

export default LandingPage;
