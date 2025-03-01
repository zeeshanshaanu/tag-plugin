import React, { useState } from "react";
import {
  InfoCircleOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import AccountModel from "../Models/AccountModel";

const UserAccounts = [
  {
    id: 1,
    Acc_number: "#32.2343",
    Acc_Creation_Date: "July 12, 2019",
    Deposit: "$100",
    Amplified: "$2100",
    Balance: "$2100",
    PNL: "+$1200",
    Trading_days: "12",
    Drawdown: "$1200",
    MaxDrawdown: "$800",
    CurrentDrawdown: "40",
    Available: "$1200",
  },
  {
    id: 2,
    Acc_number: "#92.4934",
    Acc_Creation_Date: "Dec 22, 2021",
    Deposit: "$100",
    Amplified: "$2100",
    Balance: "$2100",
    PNL: "+$1200",
    Trading_days: "12",
    Drawdown: "$1200",
    MaxDrawdown: "$800",
    CurrentDrawdown: "80",
    Available: "$1200",
  },
  {
    id: 3,
    Acc_number: "#32.1238",
    Acc_Creation_Date: "Aug 23, 2023",
    Deposit: "$100",
    Amplified: "$2100",
    Balance: "$2100",
    PNL: "+$1200",
    Trading_days: "12",
    Drawdown: "$1200",
    MaxDrawdown: "$800",
    CurrentDrawdown: "20",
    Available: "$1200",
  },
];

const AccountsDetail = ({ totalPages = 5 }) => {
  const [showBG, setshowBG] = useState("Rewards");
  const [isModalOpen, setIsModalOpen] = useState({
    isOpen: false,
    title: "",
    buttonName: "",
    desc: "",
    status: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="mt-4 lg:px-[26px] px-[12px] lg:py-[20px] py-[10px] rounded-[16px] bg-[#FFFFFF] border-[1px] border-[#EBEBEB] ">
        <div className="my-4 flex gap-3 bg-[#F5F5F5] p-2 rounded-[16px] w-[240px]">
          <h1
            onClick={() => setshowBG("Rewards")}
            className={` cursor-pointer my-auto w-[180px] text-center py-[8px] rounded-[12px] font-medium text-[#171717]
                             ${showBG === "Rewards" && "bg-[#FFFFFF]  "}`}
          >
            Active
          </h1>
          <h1
            onClick={() => setshowBG("Profile")}
            className={`cursor-pointer  my-auto w-[180px] text-center py-[8px] rounded-[12px] font-medium text-[#171717]
                             ${showBG === "Profile" && "bg-[#FFFFFF]"}`}
          >
            Deactivated
          </h1>
        </div>
        {/*  */}
        <div className="rounded-xl w-full">
          {/* Card Container */}
          {UserAccounts?.length > 0 ? (
            <>
              {UserAccounts?.map((account, index) => {
                return (
                  <>
                    {/* Black Curvy Label */}
                    <div className="mt-5 flex justify-between gap-2">
                      <div className="bg-black text-white text-[16px] px-3 pb-5 pt-2 rounded-t-[16px] inline-block inline-block relative z-10">
                        Account {account.Acc_number} • Created{" "}
                        {account.Acc_Creation_Date}
                      </div>
                      <div className="bg-[#CAFD5D] text-[#171717] text-[16px] px-3 pb-5 pt-2 rounded-t-[16px] inline-block inline-block relative z-10">
                        Credentials
                      </div>
                    </div>
                    <div
                      key={index}
                      className="bg-[#F5F5F5] p-2 rounded-[12px] mt-[-.8rem] relative z-20"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-2">
                        {/* Deposit && Amplified */}
                        <div className="col-span-1">
                          {/* Deposit && Amplified */}
                          <div
                            onClick={() =>
                              setIsModalOpen({
                                isOpen: true,
                                title: "Add more funds to your account",
                                desc: "To increase your 12X balance, add more funds; however, doing so will reset your trading days timer to zero.",
                                buttonName: "Deposit",
                                status: "Deposit",
                              })
                            }
                            className="cursor-pointer bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] h-[110px]"
                          >
                            <p className="text-[16px] text-[#171717] uppercase">
                              Deposit
                            </p>
                            <p className="lg:text-[32px] text-[22px] font-semibold mt-3">
                              {account.Deposit}
                            </p>
                          </div>
                          <div className="cursor-pointer mt-2 bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] h-[110px]">
                            <p className="text-[16px] text-[#171717] uppercase">
                              Amplified
                            </p>
                            <p className="lg:text-[32px] text-[22px] font-semibold mt-3">
                              {account.Amplified}
                            </p>
                          </div>
                        </div>
                        {/* BALANCE */}
                        <div className="bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] relative min-h-[200px]">
                          <div className="flex justify-between">
                            <p className="text-[16px] text-[#171717] my-auto">
                              BALANCE
                            </p>
                            <div className="my-auto">
                              <InfoCircleOutlined className="cursor-pointer" />
                            </div>
                          </div>
                          <p className="lg:text-[32px] text-[22px] font-semibold mt-3">
                            {account.Balance}
                          </p>

                          {/* Button Positioned at the Bottom */}
                          <div className="absolute bottom-3 left-0 w-full px-4">
                            <button className="w-full bg-[#FF4912] text-white py-2 rounded-lg text-[18px] cursor-pointer">
                              Top Up
                            </button>
                          </div>
                        </div>
                        {/* PNL */}
                        <div className="bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] relative min-h-[200px]">
                          <div className="flex justify-between">
                            <p className="text-[16px] text-[#171717] my-auto">
                              PNL
                            </p>
                            <div className="my-auto">
                              <InfoCircleOutlined className="cursor-pointer" />
                            </div>
                          </div>
                          <p className="lg:text-[32px] text-[22px] font-semibold mt-3">
                            {account.PNL}
                          </p>
                          <div className="absolute bottom-3 left-0 w-full px-4">
                            <button
                              onClick={() =>
                                setIsModalOpen({
                                  isOpen: true,
                                  title:
                                    "Use your profit to upgrade your account and increase your balance",
                                  desc: "Use your profits to increase your 12X balance. Please note, your trading days timer will reset to 0",
                                  buttonName: "Upgrade",
                                  status: "Upgrade",
                                })
                              }
                              className="w-full bg-[#FF4912] text-white py-2 rounded-lg text-[18px] cursor-pointer"
                            >
                              Upgrade
                            </button>
                          </div>
                        </div>
                        {/*  trading days */}
                        <div className="bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] ">
                          <div className="flex justify-between">
                            <p className="text-[16px] text-[#171717] my-auto uppercase">
                              trading days
                            </p>
                            <div className="my-auto">
                              <InfoCircleOutlined className="cursor-pointer" />
                            </div>
                          </div>
                          <p className="lg:lg:text-[32px] text-[22px] text-[22px] font-semibold mt-3">
                            {account.Trading_days}
                          </p>
                        </div>
                        {/* Drawdown */}
                        <div className="bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] relative min-h-[200px]">
                          <div className="flex justify-between">
                            <p className="text-[16px] text-[#171717] my-auto uppercase">
                              Drawdown
                            </p>
                            <div className="my-auto">
                              <InfoCircleOutlined className="cursor-pointer" />
                            </div>
                          </div>
                          <p className="lg:text-[32px] text-[22px] font-semibold mt-3">
                            {account.Drawdown}
                          </p>
                          <div className="absolute bottom-3 left-0 w-full px-4">
                            <div className="w-full">
                              <p className="text-[20px] font-semibold">
                                Max{" "}
                                <span className="font-semibold">
                                  {account.MaxDrawdown}
                                </span>
                              </p>
                              <div className="w-full bg-[#D1D1D1] rounded-full h-[8px] mt-2 relative">
                                <div
                                  className="bg-[#171717] h-[8px] rounded-full"
                                  style={{
                                    width: `${account.CurrentDrawdown}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Available */}
                        <div className="bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] relative min-h-[200px]">
                          <div className="flex justify-between">
                            <p className="text-[16px] text-[#171717] my-auto uppercase">
                              available
                            </p>
                            <div className="my-auto">
                              <InfoCircleOutlined className="cursor-pointer" />
                            </div>
                          </div>
                          <p className="lg:text-[32px] text-[22px] font-semibold mt-3">
                            {account.Available}
                          </p>
                          <div className="absolute bottom-3 left-0 w-full px-4">
                            <button
                              className="w-full bg-[#171717] text-white py-2 rounded-lg text-[18px] cursor-pointer"
                              onClick={() =>
                                setIsModalOpen({
                                  isOpen: true,
                                  title: "Withdraw your trading profits",
                                  buttonName: "Withdraw",
                                  status: "Withdraw",
                                })
                              }
                            >
                              Withdraw
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          ) : (
            <span className="text-red-400">No Accounts Found.!</span>
          )}
        </div>
        {/* Pagination */}
        <div className="flex justify-end items-center space-x-2 mt-5">
          {/* Previous Button */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-[16px] ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-black cursor-pointer"
            }`}
          >
            <LeftOutlined />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-[35px] h-[35px] flex items-center justify-center rounded-[8px] text-[16px] ${
                currentPage === page
                  ? "bg-[#FF4912] text-white"
                  : "text-[#171717]"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-[16px]  ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed "
                : "text-black cursor-pointer"
            }`}
          >
            <RightOutlined />
          </button>
        </div>
      </div>
      <AccountModel setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
    </div>
  );
};

export default AccountsDetail;
