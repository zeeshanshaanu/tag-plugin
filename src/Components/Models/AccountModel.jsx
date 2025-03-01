import React, { useState } from "react";
import { Button, Modal } from "antd";
const AccountModel = ({ setIsModalOpen, isModalOpen }) => {
  if (!isModalOpen.isOpen) return null;

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
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

          {isModalOpen.status && (
            <div className="mt-5 flex gap-x-3">
              <div className="w-full">
                <input
                  type="text"
                  placeholder={isModalOpen.status}
                  className="w-full p-3 border-[1px] border-[#EBEBEB] rounded-[8px]"
                />
                <span className=" left-[1px] top-[53px] text-[14px] text-[#171717]">
                  Min $50
                </span>
              </div>
              <div>
                <button className="cursor-pointer bg-[#FF4912] border-[1px] border-[#FF4912] py-3 lg:px-[30px] px-[15px] text-white rounded-[12px] ">
                  {isModalOpen.buttonName}
                </button>
              </div>
            </div>
          )}
          {!isModalOpen.status && (
            <div className="mt-4 w-full">
              <button
                onClick={() => setIsModalOpen({ isOpen: false })}
                className="w-full bg-[#FF4912] text-white py-2 rounded-lg text-[18px] cursor-pointer"
              >
                {isModalOpen.buttonName}
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
export default AccountModel;
