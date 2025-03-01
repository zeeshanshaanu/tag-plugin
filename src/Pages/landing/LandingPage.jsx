import React from "react";
import CreateAccount from "../../Components/Accounts/CreateAccount";
import AccountsDetail from "../../Components/Accounts/AccountsDetail";

const LandingPage = () => {
  return (
    <div className="lg:p-5 p-3">
      <CreateAccount />
      <AccountsDetail />
    </div>
  );
};

export default LandingPage;
