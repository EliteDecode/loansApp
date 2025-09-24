import React from "react";
import type { Column } from "../Table/Table.types";
import Table from "../Table/Table";

export default function () {
  const columns: Column[] = [
    { header: "DATE AND TIME", accessor: "date" },
    {
      header: "ACTION",
      accessor: "principal",
    },
  ];

  const data = [
    {
      id: 1,
      principal: "₦41,667",
      interest: "₦6,250",
      totalAmount: "₦850,000",
      balance: "₦850,000",
      date: "Dec 20, 2024",
      status: "Active",
    },
    {
      id: 2,
      principal: "₦30,000",
      interest: "₦4,500",
      totalAmount: "₦450,000",
      balance: "₦320,000",
      date: "Nov 12, 2024",
      status: "Pending",
    },
    {
      id: 3,
      principal: "₦55,000",
      interest: "₦8,250",
      totalAmount: "₦660,000",
      balance: "₦100,000",
      date: "Oct 5, 2024",
      status: "Completed",
    },
    {
      id: 4,
      principal: "₦25,000",
      interest: "₦3,750",
      totalAmount: "₦300,000",
      balance: "₦150,000",
      date: "Sep 18, 2024",
      status: "Overdue",
    },
    {
      id: 5,
      principal: "₦70,000",
      interest: "₦10,500",
      totalAmount: "₦980,000",
      balance: "₦980,000",
      date: "Jan 15, 2025",
      status: "Active",
    },
    {
      id: 6,
      principal: "₦60,000",
      interest: "₦9,000",
      totalAmount: "₦720,000",
      balance: "₦500,000",
      date: "Feb 2, 2025",
      status: "Pending",
    },
    {
      id: 7,
      principal: "₦45,000",
      interest: "₦6,750",
      totalAmount: "₦540,000",
      balance: "₦0",
      date: "Aug 1, 2024",
      status: "Completed",
    },
    {
      id: 8,
      principal: "₦80,000",
      interest: "₦12,000",
      totalAmount: "₦960,000",
      balance: "₦960,000",
      date: "Mar 10, 2025",
      status: "Active",
    },
    {
      id: 9,
      principal: "₦35,000",
      interest: "₦5,250",
      totalAmount: "₦420,000",
      balance: "₦200,000",
      date: "Jul 22, 2024",
      status: "Overdue",
    },
    {
      id: 10,
      principal: "₦50,000",
      interest: "₦7,500",
      totalAmount: "₦600,000",
      balance: "₦600,000",
      date: "Apr 9, 2025",
      status: "Active",
    },
  ];

  return <Table columns={columns} data={data} />;
}
