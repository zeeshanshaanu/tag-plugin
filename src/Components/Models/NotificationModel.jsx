import React, { useState } from "react";
import { Modal } from "antd";

const NotificationModel = ({ setNotifyModel, NotifyModel }) => {
  const handleOk = () => {
    setNotifyModel(false);
  };
  const handleCancel = () => {
    setNotifyModel(false);
  };
  return (
    <div>
      {" "}
      <Modal
        footer={false}
        centered
        width={630}
        height={300}
        title={false}
        open={NotifyModel?.Open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="">
          <h2
            className={`lg:text-[28px] text-[24px] font-semibold mb-[10px] w-[90%] text-[#171717]`}
          >
            {NotifyModel.title}
          </h2>
          {/* desc */}
          {NotifyModel.desc && (
            // <p className="text-[16px] leading-6">{NotifyModel.desc}</p>
            <p className={`text-[16px] leading-6 `}>{NotifyModel.desc}</p>
          )}

          {/* Input */}

          <div className="mt-5 w-full">
            <button
              onClick={() => setNotifyModel({ isOpen: false })}
              // onClick={() => HandleSubmit()}
              className="w-full bg-[#FF4912] text-white py-2 rounded-lg text-[18px] cursor-pointer"
            >
              {NotifyModel.buttonName}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationModel;
