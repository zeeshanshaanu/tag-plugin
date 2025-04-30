import React, { useState } from "react";
import { Modal } from "antd";
import axios from "axios";
import { message } from "antd";
///////////////////////////////////////////////////////////////

const AccountModel = ({ setIsModalOpen, isModalOpen }) => {
  const Token = sessionStorage.getItem("token");

  if (!isModalOpen.isOpen) return null;
  const [Loading, setLoading] = useState(false);
  const [InputValue, setInputValue] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  // console.log(isModalOpen);

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const endpoints = {
    Deposit: "/users/transactions/topup",
    Withdraw: "/users/transactions/withdraw",
    Upgrade: "/users/transactions/upgrade",
    // Topup: "/users/transactions/topup",
  };
  const LoginData = isModalOpen.login;
  // console.log(LoginData);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = endpoints[isModalOpen.status];
      // console.log(url);

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
      messageApi.success(response?.data?.message);
      setLoading(false);
      setInputValue("");
      setTimeout(() => {
        handleOk();
      }, 1000);
    } catch (error) {
      console.error(error?.response);
      messageApi.error(
        error?.response?.data?.detail || "Failed to process request"
      );
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal
        footer={false}
        centered
        width={630}
        height={300}
        title={false}
        open={isModalOpen}
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
                className="w-full bg-[#FF4912] text-white py-2 rounded-lg text-[18px] cursor-pointer"
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
                    min={50}
                    max={10000}
                    required
                    value={InputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isModalOpen.status}
                    className="w-full p-3 border-[1px] border-[#EBEBEB] rounded-[8px]"
                  />
                  <span className=" left-[1px] top-[53px] text-[14px] text-[#171717]">
                    Min $50
                  </span>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={Loading}
                    className={`GeistFont border-[1px] border-[#FF4912] py-3 lg:px-[30px] px-[15px] text-white rounded-[12px]
                ${
                  Loading
                    ? "bg-[#FF1912] cursor-wait"
                    : "bg-[#FF4912] cursor-pointer"
                }
                `}
                  >
                    {Loading ? "Loading..." : isModalOpen.buttonName}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Modal>
      {contextHolder}
    </div>
  );
};
export default AccountModel;
