import React, { useEffect, useState } from "react";
import {
  InfoCircleOutlined,
  RightOutlined,
  LeftOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import AccountModel from "../Models/AccountModel";
import axios from "axios";
import { Modal, message } from "antd";

const AccountsDetail = () => {
  const [showBG, setshowBG] = useState("Active");
  const [messageApi, contextHolder] = message.useMessage();

  const [isCredentialsModel, setisCredentialsModel] = useState({
    isOpen: false,
    title: "",
    buttonName: "",
    desc: "",
    status: "",
  });
  const [isModalOpen, setIsModalOpen] = useState({
    isOpen: false,
    title: "",
    buttonName: "",
    desc: "",
    status: "",
    login: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // default 1 page

  const [AccountDetails, setAccountDetails] = useState([]);
  const [Loading, setLoading] = useState(false);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const ActiveAcc = "/users/accounts/active";
  const DeactivatedACC = "/users/accounts/deactivated";
  useEffect(() => {
    setLoading(true);
    const FetchAccounts = async () => {
      try {
        const response = await axios.get(
          `${showBG === "Active" ? ActiveAcc : DeactivatedACC}?skip=${
            (currentPage - 1) * 5
          }&limit=10`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0udW1lcjAxNkBnbWFpbC5jb20iLCJjdXN0b21lcl9ubyI6IkNVNjYxMSIsInRpbWVzdGFtcCI6IjIwMjUtMDQtMjZUMDg6NDU6MzIiLCJpYXQiOjE3NDU2NTcxMzIsImV4cCI6MTc0NjAxNzEzMn0.UyzqzEbZ2z_I7K3_D8_nKgt8JOZymHgoinofSWZtmgA`,
            },
          }
        );
        // console.log(response.data);
        setAccountDetails(response?.data?.data);
        // Calculate pages based on total
        const totalRecords = response?.data?.total || 0;
        setTotalPages(Math.ceil(totalRecords / 5)); //
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setAccountDetails(null);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    FetchAccounts();
  }, [showBG, currentPage]);

  return (
    <div>
      <div className="mt-4 lg:px-[26px] px-[12px] lg:py-[20px] py-[10px] rounded-[16px] bg-[#FFFFFF] border-[1px] border-[#EBEBEB] ">
        <div className="GeistFont my-4 flex gap-3 bg-[#F5F5F5] p-2 rounded-[16px] w-[240px]">
          <h1
            onClick={() => setshowBG("Active")}
            className={` font-[400] cursor-pointer my-auto w-[180px] text-center py-[8px] rounded-[12px] font-medium text-[#171717]
                             ${showBG === "Active" && "bg-[#FFFFFF]  "}`}
          >
            Active
          </h1>
          <h1
            onClick={() => setshowBG("Deactivated")}
            className={`font-[400] cursor-pointer  my-auto w-[180px] text-center py-[8px] rounded-[12px] font-medium text-[#171717]
                             ${showBG === "Deactivated" && "bg-[#FFFFFF]"}`}
          >
            Deactivated
          </h1>
        </div>
        {/*  */}
        {Loading ? (
          <div className="flex justify-center items-center h-[100px] text-[#FF4913] text-[22px] font-[500]">
            Loading...
          </div>
        ) : (
          <div>
            <div className="rounded-xl w-full">
              {/* Card Container */}

              {AccountDetails?.length > 0 ? (
                <>
                  <div>
                    {AccountDetails?.map((account, index) => {
                      return (
                        <div key={index}>
                          {/* Black Curvy Label */}
                          <div className="mt-5 flex justify-between gap-2">
                            <div className="GeistFont bg-black text-white text-[16px] px-3 pb-5 pt-2 rounded-t-[16px] inline-block inline-block relative z-10">
                              Account {account?.login}&nbsp; •&nbsp; Created{" "}
                              {account?.created_at?.split("T")[0]}
                            </div>
                            <div
                              onClick={() =>
                                setisCredentialsModel({
                                  isOpen: true,
                                  login: account?.login,
                                  master_password: account?.master_password,
                                  investor_password: account?.investor_password,
                                })
                              }
                              className="GeistFont cursor-pointer bg-[#CAFD5D] text-[#171717] text-[16px] px-3 pb-5 pt-2 rounded-t-[16px] inline-block inline-block relative z-10"
                            >
                              Credentials
                              {/* show in popup */}
                              {/* login + master_password+investor_password + */}
                            </div>
                          </div>
                          <div className="bg-[#F5F5F5] p-2 rounded-[12px] mt-[-.8rem] relative z-20">
                            <div className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-2">
                              {/* Deposit && Amplified */}
                              <div className="col-span-1">
                                {/* Deposit && Amplified */}
                                <div className="cursor-pointer bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] h-[110px]">
                                  <p className="GeistFont text-[16px] text-[#171717] uppercase">
                                    Deposit
                                  </p>
                                  <p className="lg:text-[32px] text-[22px] font-[500] mt-3">
                                    ${account?.starting_amount}
                                  </p>
                                </div>
                                <div className="cursor-pointer mt-2 bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] h-[110px]">
                                  <p className="GeistFont text-[16px] text-[#171717] uppercase">
                                    Amplified
                                  </p>
                                  <p className="lg:text-[32px] text-[22px] font-[500] mt-3">
                                    $
                                    {account.multiplier *
                                      account.starting_amount}
                                  </p>
                                </div>
                              </div>
                              {/* BALANCE */}
                              <div className="bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] relative min-h-[200px]">
                                <div className="flex justify-between">
                                  <p className="GeistFont text-[16px] text-[#171717] my-auto">
                                    BALANCE
                                  </p>
                                  <div className="my-auto">
                                    <InfoCircleOutlined className="cursor-pointer" />
                                  </div>
                                </div>
                                <p className="lg:text-[32px] text-[22px] font-[500] mt-3">
                                  ${account.current_balance}
                                </p>

                                {/* Button Positioned at the Bottom */}
                                <div className="absolute bottom-3 left-0 w-full px-4">
                                  <button
                                    onClick={() =>
                                      setIsModalOpen({
                                        isOpen: true,
                                        title: "Add more funds to your account",
                                        desc: "To increase your 12X balance, add more funds; however, doing so will reset your trading days timer to zero.",
                                        buttonName: "Deposit",
                                        status: "Deposit",
                                        login: account.login,
                                      })
                                    }
                                    className="GeistFont w-full bg-[#FF4912] text-white py-2 rounded-lg text-[18px] cursor-pointer"
                                  >
                                    Top Up
                                  </button>
                                </div>
                              </div>
                              {/* PNL */}
                              <div className="bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] relative min-h-[200px]">
                                <div className="flex justify-between">
                                  <p className="GeistFont text-[16px] text-[#171717] my-auto">
                                    PNL
                                  </p>
                                  <div className="my-auto">
                                    <InfoCircleOutlined className="cursor-pointer" />
                                  </div>
                                </div>
                                <p className="lg:text-[32px] text-[22px] font-[500] mt-3">
                                  $
                                  {account.current_equity -
                                    account.current_balance}
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
                                    className="GeistFont w-full bg-[#FF4912] text-white py-2 rounded-lg text-[18px] cursor-pointer"
                                  >
                                    Upgrade
                                  </button>
                                </div>
                              </div>
                              {/*  trading days */}
                              <div className="GeistFont bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] ">
                                <div className="flex justify-between">
                                  <p className="text-[16px] text-[#171717] my-auto uppercase">
                                    trading days
                                  </p>
                                  <div className="my-auto">
                                    <InfoCircleOutlined className="cursor-pointer" />
                                  </div>
                                </div>
                                <p className="lg:text-[32px] text-[22px] font-[500] mt-3">
                                  {Math.floor(
                                    (new Date() -
                                      new Date(account?.created_at)) /
                                      (1000 * 60 * 60 * 24)
                                  )}{" "}
                                </p>
                              </div>
                              {/* Drawdown */}
                              <div className="bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] relative min-h-[200px]">
                                <div className="flex justify-between">
                                  <p className="GeistFont text-[16px] text-[#171717] my-auto uppercase">
                                    Drawdown
                                  </p>
                                  <div className="my-auto">
                                    <InfoCircleOutlined className="cursor-pointer" />
                                  </div>
                                </div>
                                <p className="lg:text-[32px] text-[22px] font-[500] mt-3">
                                  {account.yesterday_equity -
                                    account.current_balance}
                                </p>
                                <div className="absolute bottom-3 left-0 w-full px-4">
                                  <div className="w-full">
                                    <p className="text-[20px] font-[500]">
                                      Max{" "}
                                      <span className="font-[500]">
                                        {/* percent of starting_amount dd_limit */}
                                        {/*starting_amount show karani hai dd_limit dekh k  */}
                                        ${account.dd_limit}
                                      </span>
                                    </p>
                                    <div className="w-full bg-[#D1D1D1] rounded-full h-[8px] mt-2 relative">
                                      <div
                                        className="bg-[#171717] h-[8px] rounded-full"
                                        style={{
                                          width: `${account.starting_amount}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Available */}
                              <div className="bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] relative min-h-[200px]">
                                <div className="flex justify-between">
                                  <p className="GeistFont text-[16px] text-[#171717] my-auto uppercase">
                                    available
                                  </p>
                                  <div className="my-auto">
                                    <InfoCircleOutlined className="cursor-pointer" />
                                  </div>
                                </div>
                                <p className="lg:text-[32px] text-[22px] font-[500] mt-3">
                                  {account.current_balance}
                                </p>
                                <div className="absolute bottom-3 left-0 w-full px-4">
                                  <button
                                    className=" GeistFont w-full bg-[#171717] text-white py-2 rounded-lg text-[18px] cursor-pointer"
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
                        </div>
                      );
                    })}
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
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
                      )
                    )}

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
                </>
              ) : (
                <div className="flex justify-center items-center h-[100px] text-[#FF4913] text-[22px] font-[500]">
                  No Accounts Found.!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <Modal
          footer={false}
          centered
          width={430}
          // height={300}
          title={false}
          open={isCredentialsModel.isOpen}
          onCancel={() => setisCredentialsModel(false)}
        >
          <div>
            <h2 className="lg:text-[28px] text-[22px] font-[500] mb-[10px] text-center">
              Credentials
            </h2>
            {/*  */}
            <div className="mt-5 space-y-4">
              {/* Account# */}
              <div className="flex items-center gap-2">
                <span className="text-[#FF4912] font-[500] min-w-[130px]">
                  Account#:
                </span>
                <div className="flex items-center w-full py-[5px] px-3 border border-[#EBEBEB] rounded-[8px]">
                  <span className="flex-1">{isCredentialsModel?.login}</span>
                  <CopyOutlined
                    onClick={() => {
                      navigator.clipboard.writeText(isCredentialsModel?.login);
                      messageApi.success("Login copied!");
                    }}
                    className="cursor-pointer pl-4"
                  />
                </div>
              </div>

              {/* Master Password */}
              <div className="flex items-center gap-2">
                <span className="text-[#FF4912] font-[500] min-w-[130px]">
                  Master Password:
                </span>
                <div className="flex items-center w-full py-[5px] px-3 border border-[#EBEBEB] rounded-[8px]">
                  <span className="flex-1">
                    {isCredentialsModel?.master_password}
                  </span>
                  <CopyOutlined
                    onClick={() => {
                      navigator.clipboard.writeText(
                        isCredentialsModel?.master_password
                      );
                      messageApi.success("Master password copied!");
                    }}
                    className="cursor-pointer pl-4"
                  />
                </div>
              </div>

              {/* Investor Password */}
              <div className="flex items-center gap-2">
                <span className="text-[#FF4912] font-[500] min-w-[130px]">
                  Investor Password:
                </span>
                <div className="flex items-center w-full py-[5px] px-3 border border-[#EBEBEB] rounded-[8px]">
                  <span className="flex-1">
                    {isCredentialsModel?.investor_password}
                  </span>
                  <CopyOutlined
                    onClick={() => {
                      navigator.clipboard.writeText(
                        isCredentialsModel?.investor_password
                      );
                      messageApi.success("Investor password copied!");
                    }}
                    className="cursor-pointer pl-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {contextHolder}
      </div>
      <AccountModel setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
    </div>
  );
};

export default AccountsDetail;
