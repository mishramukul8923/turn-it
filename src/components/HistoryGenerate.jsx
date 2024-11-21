"use client";

import styles from './dashboard.module.css';
import { Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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


const HistoryGenerate = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [genHistory, setGeneratorHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [userId, setUserId] =  useState('');
    const userId = localStorage.getItem('userId');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // Number of items per page





    const router = useRouter();

    const saveKeyAndNavigate = (item) => {

        localStorage.setItem('keyword', JSON.stringify({
            title: item.text,
            createdId: item.createdAt
        }));

        if (typeof updategneinfo === "function") {
            updategneinfo();
        }

        router.push('/dashboard/generate');
    };







    // Function to get userId from localStorage
    const getUserId = () => {
        if (typeof window !== undefined) {
            // Access localStorage only on the client side
            const userId = localStorage.getItem('userId');
            //   setUserId(userId)
            return userId;
        }
        return null;
    };


    useEffect(() => {
        const geneHistory = async () => {
            try {
                const response = await fetch(`/api/history/generator/${userId}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const result = await response.json();
                setGeneratorHistory([...result].reverse());
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        geneHistory();
    }, []);

    const calculateTimeAgo = (timestamp) => {
        const date = new Date(timestamp); // Ensure timestamp is a Date object
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    };

    const filteredHistory = genHistory.filter((item) =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.generatedContent.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate the paginated data
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

    // Handle pagination navigation
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

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
                    <Image src="/images/genr.svg" alt="Open Menu" fluid />
                    <p>History Generate</p>
                </div>

                {/* Search Bar */}
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
                {loading ? (
                    <div>
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
                ) : error ? (
                    <p>{error}</p>
                ) : paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                        <div onClick={() => saveKeyAndNavigate(item)} key={index} className={`${styles.turnitHumanizerHistoryRedirect} w-full md:w-[calc(33.333%-17px)]`}>
                            <div className={styles.turnitHumanizerHistoryRedirectTxt}>
                                <h4>
                                    {item.text 
                                        ? item.text.split(' ').slice(0, 4).join(' ') + (item.text.split(' ').length > 4 ? '...' : '')
                                        : "No Title"
                                    }
                                </h4>
                                <div className={styles.turnitHumanizerHistoryRedirectTime}>
                                    <p>{calculateTimeAgo(item.createdAt)}</p>
                                </div>
                            </div>
                            <div className={styles.turnitHumanizerHistoryRedirectPara}>
                                <p>{item.generatedContent}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="w-full text-center text-gray-500 py-4">No results found.</p>
                )}
            </div>

            {/* Pagination Controls */}
            {/* {filteredHistory.length > itemsPerPage && (
                <div className={styles.paginationControls}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div> */}
            {/* ShadCN Pagination */}
            {filteredHistory.length > itemsPerPage && (
           <Pagination className="mt-4">
           <PaginationContent>
            
               <PaginationItem>
                   <PaginationPrevious
                       onClick={() => handlePageChange(currentPage - 1)}
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
                               onClick={() => handlePageChange(pageNum)}
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
                       onClick={() => handlePageChange(currentPage + 1)}
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

export default HistoryGenerate;
