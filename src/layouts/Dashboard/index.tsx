import { Outlet } from "react-router-dom";
import Header from "./Header";
import MobileSidebar from "./MobileSidebar";
import DesktopSidebar from "./DesktopSidebar";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal/Modal";
import ConfirmSystemShutdown from "@/components/ui/ConfirmSystemShutdown";
import ShutdownPassword from "@/components/ui/ShutdownPassword";
import ConfirmSystemRestore from "@/components/ui/ConfirmSystemRestore";
import RestorePassword from "@/components/ui/RestorePassword";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { getSystemSettings } from "@/services/features";

const index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openShutdownModal, setOpenShutdownModal] = useState(false);
  const [openShutdownPasswordModal, setOpenShutdownPasswordModal] =
    useState(false);
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const [openRestorePasswordModal, setOpenRestorePasswordModal] =
    useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { settings } = useSelector((state: RootState) => state.director);
  const { role } = useSelector((state: RootState) => state.auth);
  const isShutdown = settings?.systemStatus?.isShutdown;

  useEffect(() => {
    // ✅ Only run this when role is 'director'
    if (role === "director") {
      dispatch(getSystemSettings());
    }
  }, [dispatch, role]); // add `role` so it re-runs only when the role changes

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
        <MobileSidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setOpenShutdownModal={setOpenShutdownModal}
          setOpenRestoreModal={setOpenRestoreModal}
          isShutdown={isShutdown}
        />
      </div>
      <div className="hidden lg:block">
        <DesktopSidebar
          setOpenShutdownModal={setOpenShutdownModal}
          setOpenRestoreModal={setOpenRestoreModal}
          isShutdown={isShutdown}
        />
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
        isOpen={openRestoreModal}
        onClose={() => setOpenRestoreModal(false)}
        maxWidth="max-w-[613px]"
      >
        <ConfirmSystemRestore
          setOpenRestorePasswordModal={setOpenRestorePasswordModal}
          onClose={() => setOpenRestoreModal(false)}
        />
      </Modal>

      <Modal
        isOpen={openShutdownPasswordModal}
        onClose={() => setOpenShutdownPasswordModal(false)}
        maxWidth="max-w-[613px]"
      >
        <ShutdownPassword onClose={() => setOpenShutdownPasswordModal(false)} />
      </Modal>

      <Modal
        isOpen={openRestorePasswordModal}
        onClose={() => setOpenRestorePasswordModal(false)}
        maxWidth="max-w-[613px]"
      >
        <RestorePassword onClose={() => setOpenRestorePasswordModal(false)} />
      </Modal>
    </>
  );
};

export default index;
