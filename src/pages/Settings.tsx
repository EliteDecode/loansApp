import Button from "@/components/Button/Button";
import PageHeader from "@/components/PageHeader/PageHeader";
import add from "@/assets/icons/add.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import LoanProducts from "@/components/ui/LoanProducts";
import SystemSettings from "@/components/ui/SystemSettings";
import Modal from "@/components/Modal/Modal";
import AddNewLoan from "@/components/ui/AddNewLoan";

export default function Settings() {
  const navigate = useNavigate();
  const [addNewLoanModal, setAddNewLoanModal] = useState(false);

  const tabs = [
    { label: "Loan Products", id: "loan-products" },
    { label: "System Settings", id: "system-settings" },
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

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader
          title="Loan Products & Settings"
          subtitle="Manage your loan product offerings and configurations"
        />
        <Button
          icon={<img src={add} alt="add" />}
          onClick={() => setAddNewLoanModal(true)}
        >
          Add New Loan Product
        </Button>
      </div>

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

      {value === 0 && <LoanProducts />}
      {value === 1 && <SystemSettings />}

      <Modal
        isOpen={addNewLoanModal}
        onClose={() => setAddNewLoanModal(false)}
        closeOnOutsideClick={true} // toggle this
        title="Add New Loan Product"
        maxWidth="max-w-[855px]"
      >
        <AddNewLoan onClose={() => setAddNewLoanModal(false)} />
      </Modal>
    </div>
  );
}
