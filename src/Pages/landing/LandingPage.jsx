import React, { useEffect } from "react";
import CreateAccount from "../../Components/Accounts/CreateAccount";
import AccountsDetail from "../../Components/Accounts/AccountsDetail";
import { useLocation } from "react-router-dom";
// ////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////
const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      console.log("🔐 Token from iframe URL:", token);
    }
  }, []);

  return (
    <div className="lg:p-5 p-3">
      <CreateAccount />
      <AccountsDetail />
    </div>
  );
};

export default LandingPage;
