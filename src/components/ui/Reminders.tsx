import { Search } from "lucide-react";
import React from "react";
import type { Column } from "../Table/Table.types";
import Table from "../Table/Table";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Button/Button";
import plane from "@/assets/icons/plane.svg";
import mail from "@/assets/icons/mail.svg";

export default function Reminders() {
  const columns: Column[] = [
    { header: "CLIENT NAME", accessor: "name" },
    {
      header: "CONTACT",
      accessor: "phoneNumber",
      render: (_: string, row: any) => (
        <div>
          <p>{row.phoneNumber}</p>
          <p>{row.email}</p>
        </div>
      ),
    },
    { header: "AMOUNT DUE", accessor: "date" },
    { header: "DUE DATE", accessor: "date" },
    {
      header: "STATUS",
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
  ];

  const data = [
    {
      id: 1,
      name: "John Yinka",
      phoneNumber: "08123456789",
      email: "johnyinka@example.com",
      status: "Approved",
      date: "2025-09-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      phoneNumber: "08098765432",
      email: "jane.smith@example.com",
      status: "Pending",
      date: "2025-09-02",
    },
    {
      id: 3,
      name: "Michael Brown",
      phoneNumber: "07011223344",
      email: "michael.brown@example.com",
      status: "Overdue",
      date: "2025-09-03",
    },
    {
      id: 4,
      name: "Sophia Johnson",
      phoneNumber: "09033445566",
      email: "sophia.johnson@example.com",
      status: "Active",
      date: "2025-09-04",
    },
    {
      id: 5,
      name: "David Williams",
      phoneNumber: "08155667788",
      email: "david.williams@example.com",
      status: "Declined",
      date: "2025-09-05",
    },
  ];

  const formik = useFormik({
    initialValues: {
      notes: "",
    },
    validationSchema: Yup.object({
      notes: Yup.string()
        .min(10, "Message must be at least 10 characters")
        .required("Message is required"),
    }),
    onSubmit: (values) => {
      console.log("Form submitted:", values);
      // ✅ send values.notes to backend here
    },
  });

  return (
    <div className="space-y-10">
      <div className="space-y-[22px]">
        <div className="lg:max-w-[517px] w-full relative">
          <input
            placeholder="Search by name, phone number, or client ID"
            className="h-10 w-full pl-10 pr-3 outline-0 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] rounded-[6px] text-[14px] leading-[145%] placeholder:text-[#667185]"
          />

          <Search className="absolute top-2 left-3 w-5 h-5" color="#475367" />
        </div>
        <Table
          columns={columns}
          data={data}
          selectable={true}
          onSelectionChange={(selected) => console.log("Selected:", selected)}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-[20px] leading-[120%] tracking-[-2%] font-bold text-gray-700">
          Customize Message
        </h4>

        <div className="space-y-4">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="w-full flex-col flex gap-1">
              <label
                htmlFor="notes"
                className="text-[14px] leading-[145%] font-medium text-gray-900"
              >
                Message Template (Editable)
              </label>
              <textarea
                id="notes"
                name="notes"
                className={`resize-none h-[98px] p-4 rounded-[6px] border outline-primary ${
                  formik.touched.notes && formik.errors.notes
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Dear [Client Name], this is a reminder that your loan repayment of ₦[amount] is due on [due date]. Kindly ensure timely payment to avoid penalties."
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.notes && formik.errors.notes && (
                <span className="text-sm text-red-500">
                  {formik.errors.notes}
                </span>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Button
                type="submit"
                iconPosition="left"
                icon={<img src={plane} />}
                width="w-full md:w-[182px]"
                height="h-14"
              >
                Save Notes
              </Button>
            </div>
          </form>

          <div className="flex items-center gap-4">
            <p className="md:text-[16px] text-[14px] leading-[154%] font-medium text-gray-500">
              Reminder Method:{" "}
            </p>

            <div className="bg-[#E6EAEF] w-fit md:py-[10.5px] md:px-4 p-2 flex items-center gap-2 border-[0.8px] border-primary rounded">
              <img src={mail} alt="mail" />
              <p className="text-[16px] leading-[145%] text-primary">Email</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
