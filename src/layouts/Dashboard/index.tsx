import { Outlet } from "react-router-dom";
import Header from "./Header";
import MobileSidebar from "./MobileSidebar";
import DesktopSidebar from "./DesktopSidebar";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal/Modal";
import ConfirmSystemShutdown from "@/components/ui/ConfirmSystemShutdown";
import ShutdownPassword from "@/components/ui/ShutdownPassword";

const index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openShutdownModal, setOpenShutdownModal] = useState(false);
  const [openShutdownPasswordModal, setOpenShutdownPasswordModal] =
    useState(false);

  // Lock / unlock body scroll when sidebar opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Clean up when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      <div className="lg:hidden">
        <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div className="hidden lg:block">
        <DesktopSidebar setOpenShutdownModal={setOpenShutdownModal} />
      </div>
      <div className="w-full flex">
        <div className="overflow-hidden w-full lg:ml-[280px]">
          <div className={` min-h-[75vh] w-full`}>
            <Header isOpen={isOpen} setIsOpen={setIsOpen} />

            <div className="bg-[#F9FAFB] w-full min-h-[calc(100vh-80px)] md:px-8 px-5 pt-[150px] lg:pt-[80px]">
              <Outlet />
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openShutdownModal}
        onClose={() => setOpenShutdownModal(false)}
        maxWidth="max-w-[613px]"
      >
        <ConfirmSystemShutdown
          setOpenShutdownPasswordModal={setOpenShutdownPasswordModal}
          onClose={() => setOpenShutdownModal(false)}
        />
      </Modal>

      <Modal
        isOpen={openShutdownPasswordModal}
        onClose={() => setOpenShutdownPasswordModal(false)}
        maxWidth="max-w-[613px]"
      >
        <ShutdownPassword onClose={() => setOpenShutdownPasswordModal(false)} />
      </Modal>
    </>
  );
};

export default index;
