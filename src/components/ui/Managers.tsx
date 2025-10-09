import Button from "@/components/Button/Button";

import add from "@/assets/icons/add.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "@/components/CustomTable/CustomTable";
import type { CustomTableColumn } from "@/components/CustomTable/CustomTable.types";
import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import { getAllManagers } from "@/services/features";
import type { AppDispatch, RootState } from "@/store";
import type { Manager } from "@/services/features/manager/manager.types";

export default function Managers() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get Redux state
  const { managers, isLoading } = useSelector(
    (state: RootState) => state.director
  );
  console.log(managers);

  // Fetch credit agents on component mount
  useEffect(() => {
    dispatch(getAllManagers());
  }, [dispatch]);

  const columns: CustomTableColumn<Manager>[] = [
    {
      header: "MANAGER ID",
      accessor: "managerID",
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      header: "AGENT NAME",
      accessor: "firstName",
      render: (_: any, row: Manager) => (
        <div className="flex items-center gap-3">
          <img
            src={row.passport || profileImage}
            alt={`${row.firstName} ${row.lastName}`}
            className="w-10 h-10 object-cover rounded-full"
            onError={(e) => {
              // Fallback to default image if passport image fails to load
              e.currentTarget.src = profileImage;
            }}
          />
          <div>
            <p className="font-medium text-gray-900">
              {row.firstName} {row.lastName}
            </p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "PHONE NUMBER",
      accessor: "phoneNumber",
      render: (value: string) => <span className="text-gray-700">{value}</span>,
    },
    {
      header: "EMPLOYMENT TYPE",
      accessor: "employmentType",
      render: (value: string) => (
        <span className="capitalize text-gray-700">
          {value.replace("-", " ")}
        </span>
      ),
    },
    {
      header: "SALARY",
      accessor: "salary",
      render: (value: any) => {
        const salary = value?.amount ?? null;
        return (
          <span className="text-gray-700 font-medium">
            {salary !== null ? `₦${salary.toLocaleString()}` : "Not Available"}
          </span>
        );
      },
    },
    {
      header: "STATUS",
      accessor: "status",
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-[12px] leading-[145%] rounded-[12px] font-medium ${
            {
              active: "bg-[#0F973D1A] text-[#0F973D]",
              inactive: "bg-[#F3A2181A] text-[#F3A218]",
              suspended: "bg-[#CB1A141A] text-[#CB1A14]",
            }[value] || "bg-gray-100 text-gray-600"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      header: "DATE CREATED",
      accessor: "createdAt",
      render: (value: string) => (
        <span className="text-gray-700">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "ACTIONS",
      accessor: "_id",
      sortable: false,
      width: "120px",
      render: (_: string, row: Manager) => (
        <Button
          variant="outline"
          height="h-8"
          width="w-24"
          onClick={() => navigate(`/user-management/managers-info/${row._id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  // Use real data from Redux state
  const data = managers || [];

  return (
    <div>
      <div className="flex items-center mb-5 justify-end">
        <Button
          icon={<img src={add} alt="add" />}
          onClick={() => navigate("/user-management/manager/new")}
        >
          Add New Manager
        </Button>
      </div>

      <div className="bg-white rounded-xl space-y-[27.5px]">
        <CustomTable<Manager>
          data={data}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search by manager ID, name, email, or status"
          searchFields={
            [
              "managerID",
              "firstName",
              "lastName",
              "email",
              "status",
            ] as (keyof Manager)[]
          }
          pagination={true}
          pageSize={10}
          showPageSizeSelector={true}
          pageSizeOptions={[5, 10, 20, 50]}
          emptyMessage="No managers found"
          loading={isLoading}
          onRowClick={(row) => {
            navigate(`/user-management/managers-info/${row._id}`);
          }}
        />
      </div>
    </div>
  );
}
