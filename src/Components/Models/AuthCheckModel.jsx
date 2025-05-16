import { Modal } from "antd";

const AuthCheckModel = ({ setAuthCheck, AuthCheck }) => {
  const handleOk = () => {
    setAuthCheck(false);
  };
  const handleCancel = () => {
    setAuthCheck(false);
  };
  return (
    <div>
      <Modal
        footer={false}
        centered
        width={630}
        height={300}
        title={false}
        open={AuthCheck?.isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="">
          <h2
            className={`lg:text-[28px] text-[24px] font-semibold mb-[10px] w-[90%] text-[#171717]`}
          >
            {AuthCheck.title}
          </h2>
          {/* desc */}
          {AuthCheck.desc && (
            // <p className="text-[16px] leading-6">{NotifyModel.desc}</p>
            <p className={`text-[16px] leading-6 `}>{AuthCheck.desc}</p>
          )}

          {/* Input */}

          <div className="mt-5 w-full">
            <button
              onClick={() => {
                setAuthCheck({ isOpen: false });
                window.location.reload(); // Refresh the page
              }}
              className="w-full bg-[#CAFA5E] text-black py-2 rounded-lg text-[18px] cursor-pointer"
            >
              {AuthCheck.buttonName}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AuthCheckModel;
