'use client';

import React, { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import { Image } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const HistoryHumanizer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [humanHistory, setHumanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  useEffect(() => {
    const fetchHistory = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const response = await fetch(`/api/history/humanizer/${userId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        setHumanHistory(result.reverse());
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const router = useRouter();
  const saveKeyAndNavigate = (subItem) => {
    console.log("my key subitem: ", subItem);
    localStorage.setItem(
      "keyword",
      JSON.stringify({
        title: subItem.text,
        createdId: subItem.createdAt,
      })
    );
    router.push("/dashboard/humanizer");
  };

  const calculateTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const filteredHistory = humanHistory.filter((item) => {
    const text = typeof item?.text === "string" ? item.text : "";
    const humanizedContent =
      typeof item?.humanizedContent === "string" ? item.humanizedContent : "";
    return (
      text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      humanizedContent.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredHistory.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleBack = () => {
    router.back();
};

  return (
    <div className={styles.turnitApiDetectorheadingbg}>
      <div className={styles.turnitApiDetectorheadingsrch}>
      <div>
                        <button className={styles.turnitGenPastepadiback} onClick={handleBack}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                <path d="M8.03033 5.20794C8.32322 4.91505 8.32322 4.44018 8.03033 4.14728C7.73744 3.85439 7.26256 3.85439 6.96967 4.14728L2.625 8.49195C2.03921 9.07774 2.03921 10.0275 2.625 10.6133L6.96967 14.9579C7.26256 15.2508 7.73744 15.2508 8.03033 14.9579C8.32322 14.665 8.32322 14.1902 8.03033 13.8973L4.43566 10.3026H15C15.4142 10.3026 15.75 9.96683 15.75 9.55261C15.75 9.1384 15.4142 8.80261 15 8.80261H4.43566L8.03033 5.20794Z" fill="#FCFCFC" />
                            </svg>
                            Back
                        </button>
                    </div>
        <div className={styles.turnitApiDetectorheading}>
          <Image src="/images/thumb.svg" alt="Open Menu" fluid />
          <p>History Humanizer</p>
        </div>

        <div className={styles.turnitHumanizerHistorySearch}>
          <Input
            type="text"
            placeholder="Search history"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={`${styles.turnitHumanizerHistory} flex flex-wrap gap-[25px]`}>
        {loading && (
          <div className={styles.turnitHumanizerHistoryloader}>
            {/* <div className="ml-loader">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div> */}
           
                <div className={styles.turnitHumanizerHistoryRedirectloder}>
                <div className={`${styles.turnitHumanizerHistoryRedirect}`}>
                <div className={styles.turnitHumanizerHistoryRedirectTxt}>
                  <h4>
                    <Skeleton className="h-4 w-[100px]" />
                  </h4>
                </div>
                <div className={styles.turnitHumanizerHistoryRedirectPara}>
                  <div className="space-y-2"> 
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[50px]" />
                  </div>
                </div>
              </div>
              <div className={`${styles.turnitHumanizerHistoryRedirect}`}>
                <div className={styles.turnitHumanizerHistoryRedirectTxt}>
                  <h4>
                    <Skeleton className="h-4 w-[100px]" />
                  </h4>
                </div>
                <div className={styles.turnitHumanizerHistoryRedirectPara}>
                  <div className="space-y-2"> 
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[50px]" />
                  </div>
                </div>
              </div>
              <div className={`${styles.turnitHumanizerHistoryRedirect}`}>
                <div className={styles.turnitHumanizerHistoryRedirectTxt}>
                  <h4>
                    <Skeleton className="h-4 w-[100px]" />
                  </h4>
                </div>
                <div className={styles.turnitHumanizerHistoryRedirectPara}>
                  <div className="space-y-2"> 
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[50px]" />
                  </div>
                </div>
              </div>
              <div className={`${styles.turnitHumanizerHistoryRedirect}`}>
                <div className={styles.turnitHumanizerHistoryRedirectTxt}>
                  <h4>
                    <Skeleton className="h-4 w-[100px]" />
                  </h4>
                </div>
                <div className={styles.turnitHumanizerHistoryRedirectPara}>
                  <div className="space-y-2"> 
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[50px]" />
                  </div>
                </div>
              </div>
              <div className={`${styles.turnitHumanizerHistoryRedirect}`}>
                <div className={styles.turnitHumanizerHistoryRedirectTxt}>
                  <h4>
                    <Skeleton className="h-4 w-[100px]" />
                  </h4>
                </div>
                <div className={styles.turnitHumanizerHistoryRedirectPara}>
                  <div className="space-y-2"> 
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[50px]" />
                  </div>
                </div>
              </div>
              <div className={`${styles.turnitHumanizerHistoryRedirect}`}>
                <div className={styles.turnitHumanizerHistoryRedirectTxt}>
                  <h4>
                    <Skeleton className="h-4 w-[100px]" />
                  </h4>
                </div>
                <div className={styles.turnitHumanizerHistoryRedirectPara}>
                  <div className="space-y-2"> 
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[50px]" />
                  </div>
                </div>
              </div>
              </div>
          </div>
    
        )}
        {error && <p>Error: {error}</p>}
        {!loading && currentItems.length === 0 && (
          <p className="w-full text-center text-gray-500 py-4">No results found.</p>
        )}
        {!loading &&
          currentItems.map((item, index) => {
            const text = typeof item?.text === "string" ? item.text : "";
            const humanizedContent =
              typeof item?.humanizedContent === "string"
                ? item.humanizedContent
                : "";

            return (
              <div
                onClick={() => saveKeyAndNavigate(item)}
                key={index}
                className={`${styles.turnitHumanizerHistoryRedirect} w-full md:w-[calc(33.333%-17px)]`}
              >
                <div className={styles.turnitHumanizerHistoryRedirectTxt}>
                  <h4>
                    {text 
                      ? text.split(' ').slice(0, 4).join(' ') + (text.split(' ').length > 4 ? '...' : '')
                      : "No Title"
                    }
                  </h4>
                  <div className={styles.turnitHumanizerHistoryRedirectTime}>
                    <p>{calculateTimeAgo(item.createdAt)}</p>
                  </div>
                </div>
                <div className={styles.turnitHumanizerHistoryRedirectPara}>
                  <p>{humanizedContent || "No Content"}</p>
                </div>
              </div>
            );
          })}
      </div>

      {/* Only show pagination when not loading and there are items */}
      {!loading && currentItems.length > 0 && (
      <Pagination className="mt-4">
      <PaginationContent>
   
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            href="#"
            disabled={currentPage === 1}
          />
        </PaginationItem>

   
        {[1, 2, 3].map((pageNum) => (
          pageNum <= totalPages && (
            <PaginationItem key={pageNum} className="hidden md:inline-flex">
              <PaginationLink
                href="#"
                isActive={currentPage === pageNum}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          )
        ))}

        {totalPages > 3 && (
          <PaginationItem className="hidden md:inline-flex">
            <PaginationEllipsis />
          </PaginationItem>
        )}

    
        <PaginationItem className="md:hidden">
          <PaginationLink href="#" isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>

      
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            href="#"
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
      )}

    </div>
  );
};

export default HistoryHumanizer;
