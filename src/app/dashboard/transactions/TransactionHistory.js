"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { LuHistory } from "react-icons/lu";
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation";



import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BackBtnSVG from "@/components/AllSvg/BackBtnSVG";

const TransactionHistory = () => {
  const [allHistory, setAllHistory] = useState([]);
  const [loader, setLoader] = useState(true);
  const router = useRouter();


  const fetchTransactionHistory = async () => {
    const userID = localStorage.getItem("userId");

    // Check if userID is valid
    if (!userID) {
      console.error("User ID is not found in local storage");
      setLoader(false);
      return; // Exit the function if userID is not available
    }

    try {
      const response = await fetch(`/api/save-subscription?user_id=${userID}`);

      if (!response.ok) {
        const errorMessage = await response.text(); // Get the error message from the response
        throw new Error(`Network response was not ok: ${errorMessage}`);
      }
      else {
        const data = await response.json(); // Parse the JSON response
        setAllHistory(data.data.reverse()); // Set the fetched data to state
      }
    } catch (error) {
      console.log("Error fetching transaction history:", error);
    } finally {
      setLoader(false); // Ensure loader is set to false
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const formatData = (inputDate) => {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, "0"); // Ensure day is two digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const fetchPlan = () => {
    const plan_id = localStorage.getItem("plan_id");
    switch (plan_id) {
      case "-1":
        return `Plan Expired`;
      case "1":
        return `Basic (Monthly)`;
      case "2":
        return `Standard (Monthly)`;
      case "3":
        return `Enterprise (Monthly)`;
      case "4":
        return `Basic (Yearly)`;
      case "5":
        return `Standard (Yearly)`;
      case "6":
        return `Premium (Yearly)`;
      default:
        return `Free Plan`;
    }
  };

  const fetchPlanType = (price) => {
    switch (price) {
      case "1":
        return `Basic Monthly`;

      case "2":
        return `Standard Monthly`;

      case "3":
        return `Enterprise Monthly`;

      case "4":
        return `Basic Yearly`;

      case "5":
        return `Standard Yearly`;

      case "6":
        return `Premium Yearly`;

      default:
        return `Free Plan`
    }
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.paymentHistory}>
      <div className={styles.turnitApiDetectorheadingsrch}>
        <div>
          <button className={styles.turnitGenPastepadiback} onClick={handleBack}>
            <BackBtnSVG />
            Back
          </button>
        </div>

      </div>
      <div className={`${styles.turnitGenPaste} ${styles.turnitGenPastepadi}`}>
        <div>
          <LuHistory size={20} />
          <h2 className={styles.heading}>Transactions</h2>
        </div>
        <div className={styles.activePlan}>
          Active Plan: <span>{fetchPlan()}</span>
        </div>
      </div>

      {loader ? (
        // <div className="ml-loader ml-loader-humanizer">
        //   {[...Array(12)].map((_, index) => (
        //     <div key={index}></div>
        //   ))}
        // </div>
        <div className={styles.turnitHumanizerHistoryRedirectPara}>
          <div className="space-y-2 my-[30px]">
            <Skeleton className="h-4 w-[70%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[100%]" />
            <Skeleton className="h-4 w-[50%]" />
          </div>
        </div>
      ) : allHistory.length > 0 ? (
        <>
          <Table className={styles.historyTableshad}>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Plan Type</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Plan Start Date</TableHead>
                <TableHead >Plan Expired Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allHistory.map((data, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>{data?.paymentId}</TableCell>
                  <TableCell className={styles.planType}>
                    {fetchPlanType(data?.plan_id)}
                  </TableCell>
                  <TableCell>{formatData(data?.created_at)}</TableCell>
                  <TableCell>{formatData(data?.started_at)}</TableCell>
                  <TableCell >
                    {formatData(data?.plan_expired) || "-"}
                  </TableCell>
                  <TableCell className="text-right">${data?.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className={styles.entyInfo}>
            {allHistory.length} Entries found
          </div>
        </>
      ) : (
        <div className="no-history">No transaction history found.</div>
      )}
    </div>
  );
};

export default TransactionHistory;