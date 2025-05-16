import React, { useEffect, useState } from "react";
import AccountsDetail from "../../Components/Accounts/AccountsDetail";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AuthCheckModel from "../../Components/Models/AuthCheckModel";
// ////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////
const LandingPage = () => {
  const [AuthCheck, setAuthCheck] = useState({
    isOpen: false,
    title: "",
    desc: "",
  });
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

      const newToken = response?.data?.token;

      // Save token to sessionStorage
      sessionStorage.setItem("token", newToken);

      const url = new URL(window.location.href);
      url.searchParams.set("token", newToken);
      window.history.replaceState({}, "", url);
    } catch (error) {
      console.error(error?.response);
      if (
        error.response?.data?.detail === "Token has expired; cannot refresh."
      ) {
        setAuthCheck({
          isOpen: true,
          title: "Session Expired",
          desc: "Your session has expired. Please refresh this page",
        });
      }
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
      {/* <AuthCheckModel setAuthCheck={setAuthCheck} AuthCheck={AuthCheck} /> */}
    </div>
  );
};

export default LandingPage;
