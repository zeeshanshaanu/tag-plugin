import React, { useEffect, useState } from "react";
import {
  InfoCircleOutlined,
  RightOutlined,
  LeftOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Modal, Tooltip, message, Progress } from "antd";
import NotificationModel from "../Models/NotificationModel";

const AccountsDetail = () => {
  const Token = sessionStorage.getItem("token");
  const ApiRefetch = sessionStorage.getItem("Refetch_Accounts");
  const [daysSinceFirstTrade, setDaysSinceFirstTrade] = useState({});

  const [showBG, setshowBG] = useState("Active");
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState({
    isOpen: false,
    title: "",
    buttonName: "",
    desc: "",
    status: "",
    login: "",
    Profitvalue: "",
  });
  // console.log(isModalOpen?.Profitvalue);

  const [NotifyModel, setNotifyModel] = useState({
    Open: false,
    title: "",
    desc: "",
    status: "",
    buttonName: "",
    IsSuccess: "",
  });

  const [isCredentialsModel, setisCredentialsModel] = useState({
    isOpen: false,
    title: "",
    buttonName: "",
    desc: "",
    status: "",
  });

  const [filtersPaging, setFiltersPaging] = useState({ skip: 0, limit: 5 });
  const [Count, setCount] = useState();

  const [AccountDetails, setAccountDetails] = useState([]);
  const [TradingDays, setTradingDays] = useState({});

  const [Loading, setLoading] = useState(false);

  const ActiveAcc = "/users/accounts/active";
  const DeactivatedACC = "/users/accounts/deactivated";

  const currentPage = Math.floor(filtersPaging.skip / filtersPaging.limit) + 1;
  const totalPages = Count ? Math.ceil(Count / filtersPaging.limit) : 1;

  const prevPage = () => onPageChange(currentPage > 1 ? currentPage - 1 : 1);
  const nextPage = () =>
    onPageChange(currentPage < totalPages ? currentPage + 1 : totalPages);

  const onPageChange = (page) => {
    const newSkip = (page - 1) * filtersPaging.limit;
    setFiltersPaging((prev) => ({
      ...prev,
      skip: newSkip,
    }));
  };

  const FetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${showBG === "Active" ? ActiveAcc : DeactivatedACC}?skip=${
          filtersPaging.skip
        }&limit=${filtersPaging.limit}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      const sortedAccounts = response?.data?.data?.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      // Calculate days since first_trade_open_time for each account
      const daysMap = {};
      sortedAccounts.forEach((acc) => {
        const days = acc?.first_trade_open_time
          ? Math.round(
              (new Date() - new Date(acc.first_trade_open_time)) /
                (1000 * 60 * 60 * 24)
            )
          : 0;
        daysMap[acc._id] = days;
      });
      setTradingDays(daysMap);

      setAccountDetails(sortedAccounts);
      setCount(response?.data?.total);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setAccountDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchAccounts();
  }, [showBG, currentPage, ApiRefetch]);

  const [CreateACCLoading, setCreateACCLoading] = useState(false);
  //
  const [InputValue, setInputValue] = useState("");
  const [AccInputValue, setAccInputValue] = useState("");

  const refetchAccountsInInterval = (
    FetchAccountsFn,
    times = 3,
    intervalMs = 3000
  ) => {
    // console.log("refetchAccountsInInterval");
    // console.log("times", times);

    let count = 0;
    const interval = setInterval(() => {
      if (count < times) {
        FetchAccountsFn();
        count++;
      } else {
        clearInterval(interval);
      }
    }, intervalMs);
  };

  const CreateHandleSubmit = async (e) => {
    e.preventDefault();
    setCreateACCLoading(true);
    try {
      const response = await axios.post(
        "/users/accounts/create",
        {
          amount: AccInputValue,
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      // console.log(response?.data);
      setCreateACCLoading(false);
      setAccInputValue("");

      setTimeout(() => {
        setNotifyModel({
          Open: true,
          title: response?.data?.title,
          desc: response?.data?.desc,
          buttonName: "Continue",
          status: "create account",
          IsSuccess: true,
        });
      }, 300);
      refetchAccountsInInterval(FetchAccounts);
    } catch (error) {
      console.error(error?.response);
      // messageApi.error(error?.response?.data?.detail);
      setTimeout(() => {
        setNotifyModel({
          Open: true,
          title: error?.response?.data?.detail?.title,
          desc: error?.response?.data?.detail?.message,
          buttonName: "Continue",
          status: "create account",
          IsSuccess: false,
        });
      }, 300);
      setCreateACCLoading(false);
    }
  };

  const handleOk = () => {
    setNotifyModel(false);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setNotifyModel(false);
  };

  const endpoints = {
    Deposit: "/users/transactions/topup",
    Withdraw: "/users/transactions/withdraw",
    Upgrade: "/users/transactions/upgrade",
    CreateAccount: "/users/accounts/create",
  };

  const LoginData = isModalOpen.login;
  const [AccUpdateLoading, setAccUpdateLoading] = useState(false);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setAccUpdateLoading(true);
    try {
      const url = endpoints[isModalOpen.status];

      const response = await axios.post(
        url,
        {
          login: LoginData,
          amount: InputValue,
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      sessionStorage.setItem("Refetch_Accounts", "true");

      setTimeout(() => {
        setNotifyModel({
          Open: true,
          title: response?.data?.title,
          desc: response?.data?.desc,
          buttonName: "Continue",
          status: "create account",
          IsSuccess: true,
        });
      }, 300);

      setIsModalOpen(false);
      setAccUpdateLoading(false);
      setIsModalOpen(false);
      setInputValue("");
    } catch (error) {
      console.error(error?.response);
      setTimeout(() => {
        setNotifyModel({
          Open: true,
          title: error?.response?.data?.detail?.title,
          desc: error?.response?.data?.detail?.message,
          buttonName: "Continue",
          status: "create account",
          IsSuccess: false,
        });
        setIsModalOpen(false);
      }, 300);

      setAccUpdateLoading(false);
    }
  };

  return (
    <div>
      {/* <CreateAccount /> */}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="lg:px-[26px] px-[12px] lg:py-[20px] py-[10px] rounded-[16px] bg-[#FFFFFF] border-[1px] border-[#EBEBEB]">
          <h1 className="text-[24px] font-[500]">
            Create A New 12X Amplify Account
          </h1>
          <form onSubmit={CreateHandleSubmit}>
            <div className="mt-5 flex gap-x-3">
              <div className="w-full">
                <input
                  min={50}
                  max={10000}
                  value={AccInputValue}
                  required
                  type="number"
                  placeholder="Deposit Amount"
                  onChange={(e) => setAccInputValue(e.target.value)}
                  className="w-full p-3 border-[1px] border-[#EBEBEB] rounded-[8px]"
                />
                <span className=" left-[1px] top-[53px] text-[14px] text-[#171717]">
                  Min $50
                </span>
              </div>
              <div>
                {CreateACCLoading ? (
                  <p
                    className={`border-[1px] GeistFont border-[#CAFA5E] py-3 lg:px-[30px] px-[15px] text-black rounded-[12px] bg-[#CAFA5E] cursor-wait`}
                  >
                    Loading...
                  </p>
                ) : (
                  <button
                    type="submit"
                    disabled={CreateACCLoading}
                    className={`border-[1px] GeistFont border-[#CAFA5E] py-3 lg:px-[30px] px-[15px] text-black rounded-[12px]
                  bg-[#CAFA5E] cursor-pointer`}
                  >
                    Create
                  </button>
                )}
              </div>
            </div>
          </form>
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

          {/* <p className="mt-4 text-[14px] text-[#171717]">View more details</p> */}
        </div>
      </div>

      <div className="mt-4 lg:px-[26px] px-[12px] lg:py-[20px] py-[10px] rounded-[16px] bg-[#FFFFFF] border-[1px] border-[#EBEBEB] ">
        <div className="GeistFont my-4 flex gap-3 bg-[#F5F5F5] p-2 rounded-[16px] w-[240px]">
          <h1
            onClick={() => setshowBG("Active")}
            className={` font-[400] cursor-pointer my-auto w-[180px] text-center py-[8px] rounded-[12px] font-medium text-[#171717]
                             ${showBG === "Active" && "bg-[#FFFFFF]"}`}
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
        {/* {Loading ? (
          <div className="flex justify-center items-center h-[100px] text-[#F5F5F5] text-[22px] font-[500]">
            Loading...
          </div>
        ) : (
        )} */}
        <div className="rounded-xl w-full">
          {/* Card Container */}
          {AccountDetails?.length > 0 ? (
            <>
              <div>
                {AccountDetails?.map((account, index) => {
                  // Calculate availableBalance
                  const startingAmount = Number(account?.starting_amount);
                  const multiplier = Number(account?.multiplier);
                  const currentBalance = Number(account?.current_balance);
                  const createdAt = new Date(account?.created_at);
                  const today = new Date();

                  const TradingDays = account?.first_trade_open_time
                    ? Math.round(
                        (new Date() - new Date(account.first_trade_open_time)) /
                          (1000 * 60 * 60 * 24)
                      )
                    : 0;
                  // console.log("TradingDays--->>", TradingDays);

                  const lockingPeriod = Number(account?.locking_period);
                  // Calculate days since account was created
                  const daysSinceCreated = Math.floor(
                    (today - createdAt) / (1000 * 60 * 60 * 24)
                  );
                  // console.log("daysSinceCreated--->>", daysSinceCreated);
                  // CALCULATE Remaining Days

                  const RemainingDays = lockingPeriod - daysSinceCreated;
                  // console.log("RemainingDays->>", RemainingDays);

                  const Profitvalue =
                    currentBalance - multiplier * startingAmount;

                  const formattedProfit =
                    Profitvalue < 0 ? `$0.00` : `$${Profitvalue.toFixed(2)}`;
                  // console.log(formattedProfit);

                  // const formattedProfit =
                  //   Profitvalue < 0
                  //     ? `-$${Math.abs(Profitvalue).toFixed(2)}`
                  //     : `$${Profitvalue.toFixed(2)}`;

                  const MonthEnd = Profitvalue + startingAmount;
                  // console.log("MonthEnd-->>", MonthEnd);

                  // const availableBalance =
                  //   TradingDays > 30
                  //     ? MonthEnd
                  //     : formattedProfit

                  const availableBalance =
                    TradingDays > 30
                      ? Math.max(0, MonthEnd)
                      : Profitvalue < 0
                      ? "$0.00"
                      : formattedProfit;
                  // console.log("availableBalance--->>", availableBalance);

                  return (
                    <div key={index}>
                      {/* Black Curvy Label */}
                      {/* Black Curvy Label */}
                      <div className="mt-5 flex justify-between gap-2">
                        <div className="GeistFont bg-black text-white text-[16px] px-3 pb-5 pt-2 rounded-t-[16px] inline-block inline-block relative z-10">
                          Account {account?.login}&nbsp; •&nbsp; Created{" "}
                          {/* {account?.created_at?.split("T")[0]} */}
                          {new Date(account?.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
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
                        </div>
                      </div>
                      <div className="bg-[#F5F5F5] p-2 rounded-[12px] mt-[-.8rem] relative z-20">
                        <div className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-2">
                          {/* Deposit && Amplified */}
                          {/* Deposit && Amplified */}
                          <div className="col-span-1">
                            <div className=" bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] h-[110px]">
                              <p className="GeistFont text-[16px] text-[#171717] uppercase">
                                Deposit
                              </p>
                              <p className="lg:text-[32px] text-[22px] font-[500] mt-3">
                                ${Number(account?.starting_amount).toFixed(2)}
                              </p>
                            </div>
                            <div className=" mt-2 bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] h-[110px]">
                              <p className="GeistFont text-[16px] text-[#171717] uppercase">
                                Amplified
                              </p>
                              <p className="lg:text-[32px] text-[22px] font-[500] mt-3">
                                {(() => {
                                  const value =
                                    Number(account?.multiplier) *
                                    Number(account?.starting_amount);
                                  const formattedValue =
                                    Math.abs(value).toFixed(2);
                                  return value < 0
                                    ? `-$${formattedValue}`
                                    : `$${formattedValue}`;
                                })()}
                              </p>
                            </div>
                          </div>
                          {/* BALANCE */}
                          {/* BALANCE */}
                          <div className="bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] relative min-h-[200px]">
                            <div className="flex justify-between">
                              <p className="GeistFont text-[16px] text-[#171717] my-auto">
                                BALANCE
                              </p>
                              <div className="my-auto">
                                <Tooltip
                                  style={{ color: "black" }}
                                  title=" This is your current MT5 account balance "
                                  color={"#F5F5F5"}
                                  placement="top"
                                  overlayInnerStyle={{ color: "black" }}
                                >
                                  <InfoCircleOutlined className="cursor-pointer" />
                                </Tooltip>
                              </div>
                            </div>
                            <p className="lg:text-[32px] text-[22px] font-[500] mt-3">
                              ${Number(account.current_balance).toFixed(2)}
                            </p>

                            {/* Button Positioned at the Bottom */}
                            <div className="absolute bottom-3 left-0 w-full px-4">
                              {showBG === "Deactivated" ? (
                                <button className="GeistFont w-full bg-[#CAFA5E] opacity-50 text-black py-2 rounded-lg text-[18px] cursor-not-allowed">
                                  Top Up
                                </button>
                              ) : (
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
                                  className="GeistFont w-full bg-[#CAFA5E] text-black py-2 rounded-lg text-[18px] cursor-pointer"
                                >
                                  Top Up
                                </button>
                              )}
                            </div>
                          </div>
                          {/* Profit */}
                          {/* Profit */}
                          <div className="bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] relative min-h-[200px]">
                            <div className="flex justify-between">
                              <p className="GeistFont text-[16px] text-[#171717] my-auto uppercase">
                                Profit
                              </p>
                              <div className="my-auto">
                                <Tooltip
                                  title="This is your closed profit. Use your profits to upgrade your amplify account. Please note min trading days is reset to 0"
                                  color={"#F5F5F5"}
                                  placement="top"
                                  overlayInnerStyle={{ color: "black" }}

                                  // key={color}
                                >
                                  <InfoCircleOutlined className="cursor-pointer" />
                                </Tooltip>{" "}
                              </div>
                            </div>
                            <p className="lg:text-[32px] text-[22px] font-[500] mt-3">
                              {/* {(() => {
                                const value =
                                  Number(account?.current_balance) -
                                  Number(account?.multiplier) *
                                    Number(account?.starting_amount);
                                // const value =
                                //   Number(account?.current_equity) -
                                //   Number(account?.current_balance);
                                const formattedValue =
                                  Math.abs(value).toFixed(2);
                                return value < 0
                                  ? `-$${formattedValue}`
                                  : `$${formattedValue}`;
                              })()} */}

                              {/* {Profitvalue < 0
                                ? `$${Profitvalue.toFixed(2)}`
                                : `$${Profitvalue.toFixed(2)}`} */}
                              {/* {Profitvalue > 0
                                ? Profitvalue.toFixed(2)
                                : "$0.00"} */}
                              {formattedProfit}
                            </p>

                            <div className="absolute bottom-3 left-0 w-full px-4">
                              {showBG === "Deactivated" || Profitvalue < 50 ? (
                                <button className="GeistFont w-full bg-[#CAFA5E] opacity-50 text-black py-2 rounded-lg text-[18px] cursor-not-allowed">
                                  Upgrade
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    setIsModalOpen({
                                      isOpen: true,
                                      title:
                                        "Use your profit to upgrade your account and increase your balance",
                                      desc: "Use your profits to increase your 12X balance. Please note, your trading days timer will reset to 0",
                                      buttonName: "Upgrade",
                                      status: "Upgrade",
                                      login: account.login,
                                    })
                                  }
                                  className="GeistFont w-full bg-[#CAFA5E] text-black py-2 rounded-lg text-[18px] cursor-pointer"
                                >
                                  Upgrade
                                </button>
                              )}
                            </div>
                          </div>
                          {/*  trading days */}
                          {/*  trading days */}
                          <div className="GeistFont bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] ">
                            <div className="flex justify-between">
                              <p className="text-[16px] text-[#171717] my-auto uppercase">
                                trading days
                              </p>
                              <div className="my-auto">
                                <Tooltip
                                  title="Days since first trade"
                                  color={"#F5F5F5"}
                                  placement="top"
                                  // key={color}
                                  overlayInnerStyle={{ color: "black" }}
                                >
                                  <InfoCircleOutlined className="cursor-pointer" />
                                </Tooltip>{" "}
                              </div>
                            </div>

                            <p className="lg:text-[32px] text-[22px] font-[500] mt-3">
                              {account?.first_trade_open_time
                                ? Math.round(
                                    (new Date() -
                                      new Date(account.first_trade_open_time)) /
                                      (1000 * 60 * 60 * 24)
                                  )
                                : 0}
                            </p>
                          </div>
                          {/* Drawdown */}
                          {/* Drawdown */}
                          <div className="bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] relative min-h-[200px]">
                            <div className="flex justify-between">
                              <p className="GeistFont text-[16px] text-[#171717] my-auto uppercase">
                                equity
                              </p>
                              <div className="my-auto">
                                <Tooltip
                                  title="This is your current floating equity. If your equity level drops below your breach level your account will be deactivated."
                                  color={"#F5F5F5"}
                                  placement="top"
                                  overlayInnerStyle={{ color: "black" }}

                                  // key={color}
                                >
                                  <InfoCircleOutlined className="cursor-pointer" />
                                </Tooltip>{" "}
                              </div>
                            </div>
                            <p className="lg:text-[32px] text-[22px] font-[500] mt-3">
                              ${account?.current_equity}
                              {/* {(() => {
                                const value =
                                  Number(account?.current_equity) -
                                  Number(account?.current_balance);
                                const formattedValue =
                                  Math.abs(value).toFixed(2);
                                return value < 0
                                  ? `-$${formattedValue}`
                                  : `$${formattedValue}`;
                              })()} */}
                            </p>
                            <div className="absolute bottom-3 left-0 w-full px-4">
                              <div className="w-full">
                                <p className="text-[16px] font-[500]">
                                  Breach Level:{" "}
                                  <span className="font-[500]">
                                    {/* starting_amount */}
                                    &nbsp;
                                    {(() => {
                                      // const value =
                                      //   ((Number(account?.multiplier) *
                                      //     Number(account?.starting_amount)) /
                                      //   90);
                                      const value =
                                        Number(account.multiplier) *
                                        Number(account.starting_amount) *
                                        ((100 - Number(account.dd_limit)) /
                                          100);

                                      const formattedValue =
                                        Math.abs(value).toFixed(2);
                                      return value < 0
                                        ? `-$${formattedValue}`
                                        : `$${formattedValue}`;
                                    })()}
                                  </span>
                                </p>

                                <div className="my-auto sm:my-0 my-2">
                                  <div className="my-auto sm:my-0 my-2">
                                    <Progress
                                      percent={(() => {
                                        const equity = Number(
                                          account?.current_equity
                                        );
                                        const multiplier = Number(
                                          account?.multiplier
                                        );
                                        const startingAmount = Number(
                                          account?.starting_amount
                                        );
                                        const ddLimit = Number(
                                          account?.dd_limit
                                        );

                                        // total exposure (100% safe level)
                                        const totalExposure =
                                          multiplier * startingAmount;
                                        // breach threshold (when you want full highlight)
                                        const breachLevel =
                                          totalExposure *
                                          ((100 - ddLimit) / 100);

                                        // how far we’ve fallen from full exposure towards breach
                                        const rawProgress =
                                          (totalExposure - equity) /
                                          (totalExposure - breachLevel);

                                        // clamp 0–1
                                        const clamped = Math.max(
                                          0,
                                          Math.min(1, rawProgress)
                                        );

                                        return Math.round(clamped * 100);
                                      })()}
                                      strokeColor="#171717"
                                      className="custom-progress"
                                      showInfo={false}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Available */}
                          {/* Available */}
                          <div className="bg-white border-[1px] border-[#EBEBEB] p-[16px] rounded-[16px] relative min-h-[200px]">
                            <div className="flex justify-between">
                              <p className="GeistFont text-[16px] text-[#171717] my-auto uppercase">
                                available
                              </p>
                              <div className="my-auto">
                                <Tooltip
                                  title={`This is the amount available for withdrawal, please note initial deposit has a ${account?.locking_period} days locking period, during this time you won't be able to withdraw initial deposit but you can withdraw profits any time you want. After ${account?.locking_period} days you may withdraw your full deposit capital if you wish.`}
                                  color={"#F5F5F5"}
                                  placement="top"
                                  overlayInnerStyle={{ color: "black" }}

                                  // key={color}
                                >
                                  <InfoCircleOutlined className="cursor-pointer" />
                                </Tooltip>{" "}
                              </div>
                            </div>
                            <p className="lg:text-[32px] text-[22px] font-[500] mt-3">
                              {/* {(() => {
                                const createdAt = new Date(account?.created_at);
                                const today = new Date();
                                const daysSinceCreated = Math.floor(
                                  (today - createdAt) / (1000 * 60 * 60 * 24)
                                );
                                const lockingPeriod = Number(
                                  account?.locking_period
                                );
                                const remainingDays =
                                  lockingPeriod - daysSinceCreated;

                                if (remainingDays <= 0) {
                                  // Locking period completed
                                  return Math.max(
                                    Profitvalue + startingAmount,
                                    0
                                  ).toFixed(2);
                                } else {
                                  // Locking period still active
                                  return Math.max(Profitvalue, 0).toFixed(2);
                                }
                              })()} */}
                              {/* {MonthEnd} */}
                              {availableBalance}
                            </p>
                            <div className="absolute bottom-3 left-0 w-full px-4">
                              {/* {tradingDays === 0 && availableBalance === 0 ? ( */}
                              {availableBalance === "$0.00" ? (
                                <button className="GeistFont w-full bg-gray-400 text-white py-2 rounded-lg text-[18px] cursor-not-allowed">
                                  Withdraw
                                </button>
                              ) : showBG === "Deactivated" ? (
                                <button className="GeistFont w-full bg-gray-400 text-white py-2 rounded-lg text-[18px] cursor-not-allowed">
                                  Withdraw
                                </button>
                              ) : (
                                <button
                                  className="GeistFont w-full bg-[#171717] text-white py-2 rounded-lg text-[18px] cursor-pointer"
                                  onClick={() =>
                                    setIsModalOpen({
                                      isOpen: true,
                                      title: "Withdraw",
                                      buttonName: "Withdraw",
                                      status: "Withdraw",
                                      login: account.login,
                                      Profitvalue: availableBalance,
                                    })
                                  }
                                >
                                  Withdraw
                                </button>
                              )}
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
                  className={`p-2 rounded-[16px] ${
                    currentPage <= 1 || Loading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-black cursor-pointer"
                  }`}
                  onClick={prevPage}
                  disabled={currentPage <= 1 || Loading}
                >
                  <LeftOutlined className="text-lg" />
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`cursor-pointer w-[35px] h-[35px] flex items-center justify-center rounded-[8px] text-[16px] ${
                        currentPage === page
                          ? "bg-[#CAFA5E] text-black"
                          : "text-[#171717]"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* Next Button */}
                <button
                  className={`p-2 rounded-[16px] ${
                    currentPage >= totalPages || Loading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-black cursor-pointer"
                  }`}
                  onClick={nextPage}
                  disabled={currentPage >= totalPages || Loading}
                >
                  <RightOutlined className="text-lg" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-[100px] text-[#F5F5F5] text-[22px] font-[500]">
              No Accounts
            </div>
          )}
        </div>
      </div>
      {/* Credentials Model */}
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
                <span className="text-[#0000000] font-[500] min-w-[130px]">
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
                <span className="text-[#0000000] font-[500] min-w-[130px]">
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
                <span className="text-[#0000000] font-[500] min-w-[130px]">
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

              {/* Server */}
              <div className="flex items-center gap-2">
                <span className="text-[#0000000] font-[500] min-w-[130px]">
                  Server:
                </span>
                <div className="flex items-center w-full py-[5px] px-3 border border-[#EBEBEB] rounded-[8px]">
                  <span className="flex-1">
                    {/* {isCredentialsModel?.investor_password} */}{" "}
                    TagMarkets-Server
                  </span>
                  <CopyOutlined
                    onClick={() => {
                      navigator.clipboard.writeText("TagMarkets - Server");
                      messageApi.success("TagMarkets-Server copied!");
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

      {/* AccUpdate Model */}
      <div>
        <Modal
          footer={false}
          centered
          width={630}
          height={300}
          title={false}
          open={isModalOpen.isOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="">
            <h2 className="lg:text-[28px] text-[22px] font-semibold mb-[10px] w-[90%]">
              {isModalOpen.title}
            </h2>
            {/* desc */}
            {isModalOpen.desc && (
              <p className="text-[16px] leading-6">{isModalOpen.desc}</p>
            )}

            {/* Input */}

            {isModalOpen.status === "create account" ? (
              <div className="mt-4 w-full">
                <button
                  onClick={() => setIsModalOpen({ isOpen: false })}
                  // onClick={() => HandleSubmit()}
                  className="w-full bg-[#0000000] text-white py-2 rounded-lg text-[18px] cursor-pointer"
                >
                  {isModalOpen.buttonName}
                </button>
              </div>
            ) : (
              <form onSubmit={HandleSubmit}>
                <div className="mt-5 flex gap-x-3">
                  <div className="w-full">
                    <input
                      type="number"
                      min={1}
                      max={Number(isModalOpen?.Profitvalue).toFixed(2)}
                      required
                      value={InputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={isModalOpen.status}
                      className="w-full p-3 border-[1px] border-[#EBEBEB] rounded-[8px]"
                    />
                    {
                      isModalOpen?.status === "Withdraw" ? (
                        <span className=" left-[1px] top-[53px] text-[14px] font-bold text-[#171717]">
                          Available For Withdrawal: $
                          {Number(isModalOpen?.Profitvalue).toFixed(2)}
                        </span>
                      ) : null
                      // <span className=" left-[1px] top-[53px] text-[14px] font-bold text-[#171717]">
                      //   Min $50
                      // </span>
                    }
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={Loading}
                      className={`GeistFont border-[1px]  bg-[#CAFA5E] text-black border-[#CAFA5E] py-3 lg:px-[30px] px-[15px] rounded-[12px]
                ${
                  AccUpdateLoading
                    ? "opacity-50 cursor-wait"
                    : "opacity-100 cursor-pointer"
                }
                `}
                    >
                      {AccUpdateLoading ? "Loading..." : isModalOpen.buttonName}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </Modal>
      </div>
      <NotificationModel
        setNotifyModel={setNotifyModel}
        NotifyModel={NotifyModel}
      />
    </div>
  );
};

export default AccountsDetail;
