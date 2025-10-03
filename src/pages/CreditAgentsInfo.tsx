import React, { useEffect, useState } from "react";
import arrowLeft from "@/assets/icons/arrow-left.svg";
import editIcon from "@/assets/icons/edit-icon.svg";
import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import deactivateIcon from "@/assets/icons/deactivate-icon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/Button/Button";
import { Tab, Tabs } from "@mui/material";
import CreditAgentOverView from "@/components/ui/CreditAgentOverView";
import CreditAgentsClients from "@/components/ui/CreditAgentsClients";
import CreditAgentsLoans from "@/components/ui/CreditAgentsLoans";
import Modal from "@/components/Modal/Modal";
import EditAgent from "@/components/ui/EditAgent";

export default function CreditAgentsInfo() {
  const [openEditAgentModal, setOpenEditAgentModal] = useState(false);
  const [openDeactivateAgentModal, setOpenDeactivateAgentModal] =
    useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Overview", id: "overview" },
    { label: "Clients", id: "clients" },
    { label: "Loans", id: "loans" },
  ];

  // get tab from URL (default to first tab)
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");

  const initialTabIndex = tabs.findIndex((t) => t.id === tabFromUrl);
  const [value, setValue] = useState(
    initialTabIndex !== -1 ? initialTabIndex : 0
  );

  // update tab state when URL changes (back/forward nav)
  useEffect(() => {
    if (tabFromUrl) {
      const index = tabs.findIndex((t) => t.id === tabFromUrl);
      if (index !== -1) setValue(index);
    }
  }, [tabFromUrl]);

  // handle tab change
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const newTabId = tabs[newValue].id;
    navigate(`?tab=${newTabId}`, { replace: true }); // ✅ updates URL without reload
  };

  const agentDetails = {
    name: "Ubot Effiong",
    email: "Uboteffiong@asavictory.com",
    phoneNumber: "080123456789",
    status: "active",
  };
  return (
    <div className="space-y-6">
      <div className="p-6 bg-white space-y-4 rounded-xl">
        <div
          className="flex items-center gap-2 cursor-pointer w-fit"
          onClick={() => navigate(-1)}
        >
          <img src={arrowLeft} alt="arrowLeft" />
          <p className="text-[14px] leading-[145%] text-primary">
            back to Agents
          </p>
        </div>

        <div className="flex md:items-center items-start justify-between flex-col md:flex-row gap-4 w-full">
          <div className="flex items-center gap-6 w-full">
            <img
              src={profileImage}
              alt=""
              className="w-20 h-20 object-cover rounded-full"
            />

            <div className="space-y-2">
              <h4 className="text-[20px] leading-[120%] tracking-[-2%] text-gray-700 font-semibold">
                Ubot Effiong
              </h4>
              <p className="text-[14px] leading-[145%] text-gray-500">
                Agent ID: #AG001
              </p>
              <div className="py-1 px-3 text-[12px] leading-[145%] text-[#0088FF] bg-[#0088FF1A] w-fit rounded-xl">
                Agent
              </div>
            </div>
          </div>

          <div className="space-x-4 space-y-4 w-full">
            <Button
              variant="outline"
              icon={<img src={editIcon} alt="" />}
              onClick={() => setOpenEditAgentModal(true)}
              width="md:w-[145px] w-full"
              height="h-14"
            >
              Edit Agent
            </Button>
            <Button
              variant="danger"
              icon={<img src={deactivateIcon} alt="" />}
              onClick={() => setOpenDeactivateAgentModal(true)}
              width="md:w-[198px] w-full"
              height="h-14"
            >
              Deactivate Agent
            </Button>{" "}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white space-y-4 rounded-xl">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: "25px",
            "& .MuiTab-root": {
              textTransform: "none",
              height: 41,
              minWidth: "fit-content",
              px: 2,
              paddingY: 0,
              "@media (min-width:600px)": {
                height: 52,
              },
            },
            "& .MuiTabs-flexContainer": { gap: "16px" },
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              label={
                <div className="flex items-center gap-2 text-[14px] leading-[145%] font-medium">
                  <span className="tab-text">{tab.label}</span>
                </div>
              }
              sx={{
                textTransform: "none",
                minWidth: "fit-content",
                px: 2,
                py: 0,
                "& .tab-text": {
                  color: "#344054",
                  whiteSpace: "nowrap",
                },
                "&.Mui-selected .tab-text": {
                  color: "#002D62",
                },
                "&.Mui-selected": {
                  color: "#002D62",
                  borderBottom: "1px solid #002D62",
                  bgcolor: "#E6EAEF",
                },
              }}
            />
          ))}
        </Tabs>

        {value === 0 && <CreditAgentOverView />}
        {value === 1 && <CreditAgentsClients />}
        {value === 2 && <CreditAgentsLoans />}
      </div>

      <Modal
        isOpen={openEditAgentModal}
        onClose={() => setOpenEditAgentModal(false)}
        closeOnOutsideClick={true} // toggle this
        title="Edit Agent"
        maxWidth="max-w-[855px]"
      >
        <EditAgent data={agentDetails} />
      </Modal>

      <Modal
        isOpen={openDeactivateAgentModal}
        onClose={() => setOpenDeactivateAgentModal(false)}
        closeOnOutsideClick={true} // toggle this
        title="Confirm Action"
        maxWidth="max-w-[455px]"
      >
        <div className="space-y-8 pt-4 border-t border-gray-200">
          <p className="text-[16px] leading-[145%] text-gray-700">
            Are you sure you want to deactivate Ubot Effiong? This will restrict
            access but not delete data.
          </p>

          <div className="flex items-center justify-end gap-4 ">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpenDeactivateAgentModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger">Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
