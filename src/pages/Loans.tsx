import { useNavigate, useSearchParams } from "react-router-dom";
import LoanMetricsCard from "@/components/LoanMetricsCard/LoanMetricsCard";
import PageHeader from "@/components/PageHeader/PageHeader";
import infoHexagon from "@/assets/icons/info-hexagon.svg";
import verifiedGreen from "@/assets/icons/verifiedGreen.svg";
import blueMoney from "@/assets/icons/blue-money.svg";
import warning from "@/assets/icons/info-triangle-red.svg";
import SelectInput from "@/components/SelectInput/SelectInput";
import { ErrorMessage, Field, Form, Formik, type FieldProps } from "formik";
import { Search } from "lucide-react";

// ✅ MUI Date Imports
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import AllLoan from "@/components/ui/AllLoan";
import PendingApprovals from "@/components/ui/PendingApprovals";
import Defaults from "@/components/ui/Defaults";

export default function Loans() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs = ["All Loans", "Pending approvals", "Defaults"];

  // Hydrate initial values from URL
  const initialValues = {
    status: searchParams.get("status") || "",
    agents: searchParams.get("agents") || "",
    amount: searchParams.get("amount") || "",
    tenure: searchParams.get("tenure") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    search: searchParams.get("search") || "",
  };

  // Helper to update URL when filters change
  const updateUrl = (values: typeof initialValues) => {
    const query = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });

    navigate(`/loans?${query.toString()}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Loans"
        subtitle="Manage and track all loan applications"
      />

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <LoanMetricsCard
          title="Pending Approvals"
          value="32"
          icon={infoHexagon}
          iconBg="#FF8D281A"
        />
        <LoanMetricsCard
          title="Approved Loans"
          value="189"
          icon={verifiedGreen}
          iconBg="#20C9971A"
        />
        <LoanMetricsCard
          title="Disbursed Loans"
          value="95"
          icon={blueMoney}
          iconBg="#0088FF1A"
        />
        <LoanMetricsCard
          title="Defaulted"
          value="10"
          icon={warning}
          iconBg="#FF8D281A"
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={() => {}} // no normal submit
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <SelectInput
                    name="status"
                    label="Status"
                    onChange={(e: any) => {
                      setFieldValue("status", e.target.value);
                      updateUrl({ ...values, status: e.target.value });
                    }}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="disbursed">Disbursed</option>
                    <option value="defaulted">Defaulted</option>
                  </SelectInput>

                  <SelectInput
                    name="agents"
                    label="Agents"
                    onChange={(e: any) => {
                      setFieldValue("agents", e.target.value);
                      updateUrl({ ...values, agents: e.target.value });
                    }}
                  >
                    <option value="">All Agents</option>
                    <option value="john">John</option>
                    <option value="jane">Jane</option>
                  </SelectInput>

                  <SelectInput
                    name="amount"
                    label="Amount Range"
                    onChange={(e: any) => {
                      setFieldValue("amount", e.target.value);
                      updateUrl({ ...values, amount: e.target.value });
                    }}
                  >
                    <option value="">Amount Range</option>
                    <option value="0-1000">$0 - $1000</option>
                    <option value="1000-5000">$1000 - $5000</option>
                    <option value="5000+">$5000+</option>
                  </SelectInput>

                  <SelectInput
                    name="tenure"
                    label="Tenure"
                    onChange={(e: any) => {
                      setFieldValue("tenure", e.target.value);
                      updateUrl({ ...values, tenure: e.target.value });
                    }}
                  >
                    <option value="">All Tenures</option>
                    <option value="3m">3 Months</option>
                    <option value="6m">6 Months</option>
                    <option value="12m">12 Months</option>
                  </SelectInput>

                  <div className="flex flex-col gap-0 w-full">
                    <label className="font-medium text-gray-900 text-[14px] leading-[145%]">
                      Start Date
                    </label>
                    <Field name="startDate">
                      {({ field, form }: FieldProps) => (
                        <DatePicker
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(val) => {
                            const formatted = val
                              ? val.format("YYYY-MM-DD")
                              : "";
                            form.setFieldValue(field.name, formatted);
                            updateUrl({ ...form.values, startDate: formatted });
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: Boolean(
                                form.touched.startDate && form.errors.startDate
                              ),
                            },
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="startDate"
                      component="span"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* End Date */}
                  <div className="flex flex-col gap-0 w-full">
                    <label className="font-medium text-gray-900 text-[14px] leading-[145%]">
                      End Date
                    </label>
                    <Field name="endDate">
                      {({ field, form }: FieldProps) => (
                        <DatePicker
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(val) => {
                            const formatted = val
                              ? val.format("YYYY-MM-DD")
                              : "";
                            form.setFieldValue(field.name, formatted);
                            updateUrl({ ...form.values, endDate: formatted });
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: Boolean(
                                form.touched.endDate && form.errors.endDate
                              ),
                            },
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="endDate"
                      component="span"
                      className="text-red-500 text-xs"
                    />
                  </div>
                </div>

                {/* Search Input */}
                <div className="w-full relative">
                  <input
                    placeholder="Search by Client Name, Loan ID, or Phone Number..."
                    className="h-10 w-full pl-10 pr-3 outline-0 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] rounded-[6px] text-[14px] leading-[145%] placeholder:text-[#667185]"
                    value={values.search}
                    onChange={(e) => {
                      setFieldValue("search", e.target.value);
                      updateUrl({ ...values, search: e.target.value });
                    }}
                  />
                  <Search
                    className="absolute top-2 left-3 w-5 h-5"
                    color="#475367"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </LocalizationProvider>
      </div>

      <div className="bg-white p-6 rounded-xl space-y-6">
        <h1 className="text-[24px] leading-[120%] tracking-[-2%] font-medium text-gray-700">
          Loan Applications
        </h1>

        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable" // ✅ allow horizontal scrolling
          scrollButtons="auto"
          sx={{
            mb: "25px",
            "& .MuiTab-root": {
              textTransform: "none",
              height: 41,
              minWidth: "fit-content", // ✅ shrink to fit content
              px: 2, // ✅ 16px left/right padding (MUI spacing: 2 = 16px)
              paddingY: 0, // keep height tight

              "@media (min-width:600px)": {
                height: 52,
              },
            },

            "& .MuiTabs-flexContainer": {
              gap: "16px", // ✅ spacing between each Tab
            },

            "& .MuiTabs-indicator": { display: "none" }, // hide underline if you want bg active
          }}
          className="space-y-10"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={
                <div className="flex items-center gap-2 text-[14px] leading-[145%] font-medium">
                  <span className="tab-text">{tab}</span>
                </div>
              }
              sx={{
                textTransform: "none",
                minWidth: "fit-content", // ✅ don’t force extra width
                px: 2, // ✅ 16px left/right padding
                py: 0,

                "& .tab-text": {
                  color: "#344054", // default
                  whiteSpace: "nowrap", // ✅ prevents breaking text
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

        {value === 0 && <AllLoan />}
        {value === 1 && <PendingApprovals />}
        {value === 2 && <Defaults />}
      </div>
    </div>
  );
}
