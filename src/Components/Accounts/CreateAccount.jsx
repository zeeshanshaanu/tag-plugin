import React, { useState } from "react";
import AccountModel from "../Models/AccountModel";

const CreateAccount = () => {
  const [isModalOpen, setIsModalOpen] = useState({
    isOpen: false,
    title: "",
    buttonName: "",
    desc: "",
    status: "",
  });
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="lg:px-[26px] px-[12px] lg:py-[20px] py-[10px] rounded-[16px] bg-[#FFFFFF] border-[1px] border-[#EBEBEB] ">
          <h1 className="text-[24px] font-semibold">
            Create A New 12X Amplify Account
          </h1>
          <div className="mt-5 flex gap-x-3">
            <div className="w-full">
              <input
                type="text"
                placeholder="Deposit Amount"
                className="w-full p-3 border-[1px] border-[#EBEBEB] rounded-[8px]"
              />
              <span className=" left-[1px] top-[53px] text-[14px] text-[#171717]">
                Min $50
              </span>
            </div>
            <div>
              <button
                onClick={() =>
                  setIsModalOpen({
                    isOpen: true,
                    title: "Your 12X account is now Ready for trading",
                    buttonName: "Continue",
                    desc: "Please review your email for your login details, including your username and password. Alternatively, you can click the credentials button on your dashboard for quick access.",
                  })
                }
                className="cursor-pointer bg-[#FF4912] border-[1px] border-[#FF4912] py-3 px-[50px] text-white rounded-[12px] "
              >
                Create
              </button>
            </div>
          </div>
        </div>
        <div className="lg:px-[26px] px-[12px] lg:py-[20px] py-[10px] rounded-[16px] bg-[#FFFFFF] border-[1px] border-[#EBEBEB]">
          <div className="flex gap-3">
            <h1 className="my-auto text-[16px] font-semibold bg-[#CAFD5D] rounded-[8px] py-[6px] px-[12px] text-center">
              1
            </h1>
            <h4 className="my-auto text-[16px] text-[#171717]">
              Input your deposit amount to create your 12X amplify account
            </h4>
          </div>

          <div className="flex gap-3 mt-3">
            <h1 className="my-auto text-[16px] font-semibold bg-[#CAFD5D] rounded-[8px] py-[6px] px-[12px] text-center">
              2
            </h1>
            <h4 className="my-auto text-[16px] text-[#171717]">
              Instantly start trading and withdraw profits{" "}
            </h4>
          </div>

          <div className="flex gap-3 mt-3">
            <h1 className="my-auto text-[16px] font-semibold bg-[#CAFD5D] rounded-[8px] py-[6px] px-[12px] text-center">
              3
            </h1>
            <h4 className="my-auto text-[16px] text-[#171717]">
              Don’t lose more than 10% of your starting balance{" "}
            </h4>
          </div>

          <p className="mt-4 text-[14px] text-[#171717]">View more details</p>
        </div>
      </div>
      <AccountModel setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
    </div>
  );
};

export default CreateAccount;
