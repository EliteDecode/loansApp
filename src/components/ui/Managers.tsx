import dayjs from "dayjs";
import { Field, Form, Formik } from "formik";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SelectInput from "../SelectInput/SelectInput";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as Yup from "yup";
import Button from "../Button/Button";
import add from "@/assets/icons/add.svg";
import type { Column } from "../Table/Table.types";
import rightArrow from "@/assets/icons/rightArrow.svg";
import leftArrow from "@/assets/icons/leftArrow.svg";
import addPrimary from "@/assets/icons/addPrimary.svg";
import Table from "../Table/Table";
import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import Modal from "../Modal/Modal";
import EditManager from "./EditManager";
import ManagerDetails from "./ManagerDetails";
import DeactivateManager from "./DeactivateManager";

const validationSchema = Yup.object().shape({
  startDate: Yup.date().nullable(),
  endDate: Yup.date()
    .nullable()
    .min(Yup.ref("startDate"), "End date cannot be before start date"),
});

export default function Managers() {
  const navigate = useNavigate();
  const location = useLocation();
  const [age, setAge] = useState("");
  // Modals
  const [editmanager, setEditmanager] = useState(false);
  const [managerDetails, setManagerDetails] = useState(false);
  const [deactivateManager, setDeactivateManager] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const searchFromUrl = queryParams.get("search") || "";
  const statusFromUrl = queryParams.get("status") || "";
  const startDateFromUrl = queryParams.get("startDate");
  const endDateFromUrl = queryParams.get("endDate");

  const columns: Column[] = [
    {
      header: "NAME",
      accessor: "phoneNumber",
      render: (_: any, row: any) => (
        <div className="flex items-center flex-row gap-3">
          <img
            src={profileImage}
            alt=""
            className="w-10 h-10 object-cover rounded-full "
          />
          <p className="max-w-[100px] break-words">{row.name}</p>
        </div>
      ),
    },
    { header: "EMAIL", accessor: "phoneNumber" },
    { header: "PHONE NUMBER", accessor: "phoneNumber" },

    {
      header: "LOAN STATUS",
      accessor: "status",
      render: (value: string) => (
        <span
          className={`px-2 text-[12px] leading-[145%] rounded-[12px] ${
            {
              Approved: "bg-[#0F973D1A] text-[#0F973D]",
              Pending: "bg-[#F3A2181A] text-[#F3A218]",
              Overdue: "bg-[#CB1A141A] text-[#CB1A14]",
            }[value] || "bg-gray-100 text-gray-600" // fallback for unknown values
          }`}
        >
          {value}
        </span>
      ),
    },
    { header: "LAST ACTION", accessor: "phoneNumber" },
  ];

  const data = [
    {
      id: 1,
      name: "John Yinka",
      phoneNumber: "08123456789",
      status: "Approved",
      date: "2025-09-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      phoneNumber: "08098765432",
      status: "Pending",
      date: "2025-09-02",
    },
    {
      id: 3,
      name: "Michael Brown",
      phoneNumber: "07011223344",
      status: "Overdue",
      date: "2025-09-03",
    },
    {
      id: 4,
      name: "Sophia Johnson",
      phoneNumber: "09033445566",
      status: "Active",
      date: "2025-09-04",
    },
    {
      id: 5,
      name: "David Williams",
      phoneNumber: "08155667788",
      status: "Declined",
      date: "2025-09-05",
    },
  ];

  const fakemanagerDetails = {
    name: "Ubot Effiong",
    AgentID: "#AG001",
    email: "Uboteffiong@asavictory.com",
    phoneNumber: "080123456789",
    status: "active",
  };

  const handleRowClick = (row: any) => {
    console.log("Row clicked:", row);
    setManagerDetails(true);
    // e.g. open a modal with row details
    // setSelectedRow(row);
    // setIsModalOpen(true);
  };

  return (
    <div>
      <div className="bg-white p-6">
        <Formik
          initialValues={{
            search: searchFromUrl,
            status: statusFromUrl,
            startDate: startDateFromUrl ? dayjs(startDateFromUrl) : null,
            endDate: endDateFromUrl ? dayjs(endDateFromUrl) : null,
          }}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values) => {
            const params = new URLSearchParams();

            if (values.search) params.set("search", values.search);
            if (values.status) params.set("status", values.status);
            if (values.startDate)
              params.set(
                "startDate",
                dayjs(values.startDate).format("YYYY-MM-DD")
              );
            if (values.endDate)
              params.set("endDate", dayjs(values.endDate).format("YYYY-MM-DD"));

            navigate(`?${params.toString()}`, { replace: true });
          }}
        >
          {({
            values,
            // handleChange,
            handleSubmit,
            setFieldValue,
            errors,
            touched,
          }) => {
            // Auto submit whenever filters change
            useEffect(() => {
              handleSubmit();
            }, [
              values.search,
              values.status,
              values.startDate,
              values.endDate,
            ]);

            return (
              <Form className="space-y-6">
                {/* Search Input */}
                <div className="flex items-center justify-between">
                  <div className="lg:max-w-[540px] w-full relative">
                    <Field
                      name="search"
                      placeholder="Search agents by name or status"
                      className="h-10 w-full pl-10 pr-3 outline-0 shadow-[0px_1px_2px_0px_#1018280D] rounded-[6px] text-[14px] leading-[145%] placeholder:text-[#667185] bg-gray-50"
                    />
                    <Search
                      className="absolute top-2 left-3 w-5 h-5"
                      color="#475367"
                    />
                  </div>

                  <Button
                    icon={<img src={add} />}
                    // onClick={() => setManagerDetails(true)}
                  >
                    Add New Manager
                  </Button>
                </div>

                {/* Filters */}
                <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                  <SelectInput name="status" label="Status">
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </SelectInput>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Start Date
                      </label>
                      <DatePicker
                        value={values.startDate}
                        onChange={(newValue) => {
                          setFieldValue("startDate", newValue);
                          if (
                            values.endDate &&
                            newValue &&
                            dayjs(values.endDate).isBefore(newValue)
                          ) {
                            setFieldValue("endDate", null); // auto clear invalid endDate
                          }
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error:
                              touched.startDate && Boolean(errors.startDate),
                            helperText: touched.startDate && errors.startDate,
                          },
                        }}
                      />
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        End Date
                      </label>
                      <DatePicker
                        value={values.endDate}
                        onChange={(newValue) =>
                          setFieldValue("endDate", newValue)
                        }
                        minDate={values.startDate || undefined} // disable before start date
                        disabled={!values.startDate}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: touched.endDate && Boolean(errors.endDate),
                            helperText: touched.endDate && errors.endDate,
                          },
                        }}
                      />
                    </div>
                  </LocalizationProvider>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>

      <div className="bg-white p-6 rounded-xl space-y-[27.5px]">
        <h1 className="text-[24px] leading-[120%] tracking-[-2%] font-medium text-gray-700">
          Manager
        </h1>

        <div className="flex items-center justify-between">
          <div className="lg:max-w-[517px] w-full relative">
            <input
              placeholder="Search by name, phone number, or client ID"
              className="h-10 w-full pl-10 pr-3 outline-0 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] rounded-[6px] text-[14px] leading-[145%] placeholder:text-[#667185]"
            />

            <Search className="absolute top-2 left-3 w-5 h-5" color="#475367" />
          </div>

          <div className="space-x-4 hidden md:block">
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="py-3 px-4 bg-gray-50 border border-gray-100 rounded-[8px] text-gray-700 text-[16px] leading-[145%] outline-none"
            >
              <option value="">Status</option>
              <option value={10}>Ten</option>xw
              <option value={20}>Twenty</option>
              <option value={30}>Thirty</option>
            </select>

            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="py-3 px-4 bg-gray-50 border border-gray-100 rounded-[8px] text-gray-700 text-[16px] leading-[145%] outline-none"
            >
              <option value="">Date Added</option>
              <option value={10}>Ten</option>xw
              <option value={20}>Twenty</option>
              <option value={30}>Thirty</option>
            </select>
          </div>
        </div>
        <Table columns={columns} data={data} onRowClick={handleRowClick} />
        <div className="flex items-center justify-between text-[14px] leadng-[145%] text-gray-700 font-semibold">
          <button className="sm:px-4 px-2 py-2 flex items-center gap-2 border border-gray-300 rounded-[8px] cursor-pointer">
            <img src={addPrimary} className="hidden sm:block" />
            <p className="hidden sm:block">Previous</p>
            <img src={leftArrow} className="block sm:hidden" />
          </button>

          <p>Showing 1–20 of 250 clients</p>

          <button className="sm:px-4 px-2 py-2 flex items-center gap-2 border border-gray-300 rounded-[8px] cursor-pointer">
            <p className="hidden sm:block">Next</p>
            <img src={addPrimary} className="hidden sm:block" />
            <img src={rightArrow} className="block sm:hidden" />
          </button>
        </div>
      </div>

      <Modal
        isOpen={managerDetails}
        onClose={() => setManagerDetails(false)}
        closeOnOutsideClick={true} // toggle this
        title="Manager Details"
        maxWidth="max-w-[593px]"
      >
        <ManagerDetails
          // data={fakemanagerDetails}
          onCancel={() => setManagerDetails(false)}
          setDeactivateManager={setDeactivateManager}
          setEditmanager={setEditmanager}
        />
      </Modal>

      <Modal
        isOpen={editmanager}
        onClose={() => setEditmanager(false)}
        closeOnOutsideClick={true} // toggle this
        title="Edit Manager"
        maxWidth="max-w-[855px]"
      >
        <EditManager
          data={fakemanagerDetails}
          onCancel={() => setEditmanager(false)}
        />
      </Modal>

      <Modal
        isOpen={deactivateManager}
        onClose={() => setDeactivateManager(false)}
        closeOnOutsideClick={true}
        title="Confirm Action"
        maxWidth="max-w-[455px]"
      >
        <DeactivateManager onCancel={() => setDeactivateManager(false)} />
      </Modal>
    </div>
  );
}
