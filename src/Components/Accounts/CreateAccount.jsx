import React, { useState } from "react";
import AccountModel from "../Models/AccountModel";
import axios from "axios";
import { message } from "antd";
///////////////////////////////////////////////////////////////
const CreateAccount = () => {
  const Token = sessionStorage.getItem("token");

  const [InputValue, setInputValue] = useState("");
  const [Loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [isModalOpen, setIsModalOpen] = useState({
    isOpen: false,
    title: "",
    buttonName: "",
    desc: "",
    status: "",
  });

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "/users/accounts/create",
        {
          amount: InputValue,
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      sessionStorage.setItem("Refetch_Accounts", "true");

      console.log(response?.data);
      // messageApi.success("Account Created Successfully");
      setLoading(false);
      setInputValue("");
      setIsModalOpen({
        isOpen: true,
        title: "Your Amplify Account Is Now ready To Trade",
        desc: "You will recieve an email shortly with your MT5 account credentials. Alternatively, you can click the credentials button on your dashboard for quicker access",
        buttonName: "Continue",
        status: "create account",
      });
    } catch (error) {
      console.error(error?.response);
      messageApi.error(error?.response?.data?.detail);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="lg:px-[26px] px-[12px] lg:py-[20px] py-[10px] rounded-[16px] bg-[#FFFFFF] border-[1px] border-[#EBEBEB]">
          <h1 className="text-[24px] font-[500]">
            Create A New 12X Amplify Account
          </h1>
          <form onSubmit={HandleSubmit}>
            <div className="mt-5 flex gap-x-3">
              <div className="w-full">
                <input
                  min={50}
                  max={10000}
                  value={InputValue}
                  required
                  type="number"
                  placeholder="Deposit Amount"
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full p-3 border-[1px] border-[#EBEBEB] rounded-[8px]"
                />
                <span className=" left-[1px] top-[53px] text-[14px] text-[#171717]">
                  Min $50
                </span>
              </div>
              <div>
                {Loading ? (
                  <p
                    className={`border-[1px] GeistFont border-[#FF4912] py-3 lg:px-[30px] px-[15px] text-white rounded-[12px] bg-[#FF1912] cursor-wait`}
                  >
                    Loading...
                  </p>
                ) : (
                  <button
                    type="submit"
                    disabled={Loading}
                    className={`border-[1px] GeistFont border-[#FF4912] py-3 lg:px-[30px] px-[15px] text-white rounded-[12px]
                  bg-[#FF4912] cursor-pointer`}
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

          <p className="mt-4 text-[14px] text-[#171717]">View more details</p>
        </div>
      </div>
      {contextHolder}
      <AccountModel setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
    </div>
  );
};

export default CreateAccount;
