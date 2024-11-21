"use client";
import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';
import { Image } from 'react-bootstrap';
import formatContent from '@/utils/FormatContent';
import DecodeTokenEmail from '@/utils/DecodeTokenEmail';
import FetchUserDetails from '@/utils/FetchUserDetails';
import { useToast } from "@/hooks/use-toast"
import { Toast } from "@/components/ui/toast"
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton"
import { MdDoNotDisturb } from 'react-icons/md';


const Generate = ({ fetchData }) => {

    const [plan_id, setPlan_id] = useState("");

    useEffect(() => {
        if (localStorage.getItem("keyword")) {
            fetchHisrotyData()
        }
    }, [fetchData])


    const [text, setText] = useState('');
    const [isFirstContainerVisible, setIsFirstContainerVisible] = useState(true);
    const [humanWordCount, sethumanWordCount] = useState(0);
    const [humanCharCount, sethumanCharCount] = useState(0);
    const [fineData, setFineData] = useState('');
    const [showHumanizerContent, setShowHumanizerContent] = useState('');
    const [nextInput, setNextInput] = useState('')
    const [generatedContent, setGeneratedContent] = useState(fineData);
    const [updateData, setUpdateData] = useState()
    const [loading, setLoading] = useState(false) // initially set loading to false
    const [user_id, setUser_id] = useState();

    const { toast } = useToast()
    const [copied, setCopied] = useState(false)
    const [regenerated, setRegenerated] = useState(false)

    const router = useRouter();






    const fetchHisrotyData = async () => {

        const data = JSON.parse(localStorage.getItem('keyword'));
        const createdId = data.createdId;
        const title = data.title;
        const userId = localStorage.getItem("userId")

        if (createdId && title) {
            console.log("created and title get in generate component")
            setIsFirstContainerVisible(false)
            setText(title);

            // const fetchHistoryData = async (userId) => {
            // try {
            const response = await fetch(`/api/history/generator/${userId}`);


            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Failed to fetch history data');
            }
            else {
                // Parse the response as JSON
                const data = await response.json();
                // Client-side filtering: Filter data based on title and createdId

                const filteredData = data.filter(item =>
                    item.text === title && item.createdAt === createdId
                );
                // Set the filtered data into state
                // console.log("this is filtered data", filteredData)
                // console.log("this is filtered generatedContent", filteredData[0].generatedContent)
                // if (fineData) {
                setFineData(filteredData[0]?.generatedContent);

                // }

                localStorage.removeItem('keyword');
            }

        }
    };



    const fetchUserId = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const email = DecodeTokenEmail(token);
                if (email) {
                    const userDetails = await FetchUserDetails(email);
                    setUser_id(userDetails[0]._id)
                    return userDetails[0]?._id;
                }
            }
        } catch (error) {
            console.error("Failed to fetch user ID:", error);
        }
    };


    useEffect(() => {
        setPlan_id(localStorage.getItem("plan_id"));
        fetchUserId();

    }, [])







    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleEraseClick = () => {
        setIsFirstContainerVisible(true);
    };

    const humanContent = (e) => {
        handlehumanTextChange();
        setShowHumanizerContent(fineData)
    }

    useEffect(() => {
        handlehumanTextChange()
    }, [fineData, nextInput, text])

    const handlehumanTextChange = () => {
        sethumanCharCount(fineData && fineData.length);
        sethumanWordCount(fineData && fineData.trim().split(/\s+/).length);
        // console.log("humanized content", showHumanizerContent)
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from reloading the page
        // Check if textarea is empty
        if (text.trim() === '') {
            toast({
                title: "Error",
                description: "Please enter some text",
                variant: "destructive",
            });
            return;
        }
        setLoading(true); // Start loading
        console.log("Request sent with:", { text });
        setIsFirstContainerVisible(false);

        try {
            const response = await fetch('https://qaiegn55pb.us-east-1.awsapprunner.com/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': '9816000016',
                    'Accept': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({
                    topic: nextInput ? nextInput : text
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                toast({
                    title: 'Error',
                    description: 'Something Went Wrong, Please Try Again.',
                    variant: 'error',
                });
            }

            const result = await response.json();
            setFineData(result.content[0].text.split("\n")[2]?.trim());

            setLoading(false);
            console.log('Data received:', result);
        } catch (error) {
            console.error('Error submitting data:', error);
            setLoading(false);
            toast({
                title: 'Error',
                description: 'An error occurred while submitting data.',
                variant: 'error',
            });
        }
    };

    const handleCopyClick = () => {
        setCopied(true);
        navigator.clipboard.writeText(fineData)
            .then(() => toast({
                title: "Success",
                description: "Text copied to clipboard!",
                variant: 'success',
            }))
            .catch((err) => {
                console.error("Failed to copy text: ", err);
                toast({
                    title: 'Error',
                    description: 'Failed to copy text.',
                    variant: 'error',
                });
            });
    };

    const handleRefreshClick = () => {
        window.location.reload();
    };

    useEffect(() => {
        // Only run the effect if fineData is not empty
        if (fineData) {
            const timer = setTimeout(() => {
                handleSaveContent();
            }, 1000);

            // Clear the timer if the component unmounts or fineData changes
            return () => clearTimeout(timer);
        }
    }, [fineData]);

    const handleSaveContent = async () => {
        const token = localStorage.getItem('token');
        const email = DecodeTokenEmail(token);
        if (fineData == '' && (text == '' || nextInput == "")) {
            console.log("generate content or text can't be empty!");
            return;
        }
        try {
            const response = await fetch('/api/generatedContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: nextInput ? nextInput : text,
                    generatedContent: fineData,
                    user_id: user_id,
                    email: email,
                    copied: copied,
                }),
            });

            if (response.ok) {
                const result = await response.json()
                setPlan_id(result?.data?.plan_id)
                localStorage.setItem("plan_id", result?.data?.plan_id)
                // console.error(' save data successfully');
            } else {
                // console.error('Failed to save data');
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };


    // Handle "Paste Text" button click
    const handlePasteText = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            setText(clipboardText);
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    };


    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const charCount = text.length;

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
    }

    const handleBack = () => {
        router.back();
    };

    return (
        <div className={styles.turnitGencontainer}>
            {isFirstContainerVisible ? (
                // First container
                <div className={styles.turnitGencontainerFirst}>
                    <div className={styles.turnitGenPaste}>
                        <div>
                            <button className={styles.turnitGenPastepadiback} onClick={handleBack}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                    <path d="M8.03033 5.20794C8.32322 4.91505 8.32322 4.44018 8.03033 4.14728C7.73744 3.85439 7.26256 3.85439 6.96967 4.14728L2.625 8.49195C2.03921 9.07774 2.03921 10.0275 2.625 10.6133L6.96967 14.9579C7.26256 15.2508 7.73744 15.2508 8.03033 14.9579C8.32322 14.665 8.32322 14.1902 8.03033 13.8973L4.43566 10.3026H15C15.4142 10.3026 15.75 9.96683 15.75 9.55261C15.75 9.1384 15.4142 8.80261 15 8.80261H4.43566L8.03033 5.20794Z" fill="#FCFCFC" />
                                </svg>
                                Back
                            </button>
                        </div>
                        <h2 className={styles.heading}>
                            <Image src="/images/genr.svg" alt="Open Menu" fluid />
                            Generate
                        </h2>
                        <div className="tooltip-container">
                            <button onClick={handlePasteText}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="27" viewBox="0 0 24 27" fill="none">
                                    <path d="M23.2362 6.72916C23.1132 6.4547 22.9412 6.20112 22.733 5.97685C22.733 5.97685 18.0231 1.26699 18.0231 1.26698C17.5722 0.816083 16.9397 0.552612 16.302 0.552612C16.3019 0.552612 9.69077 0.552612 9.69077 0.552612C8.3521 0.552612 7.26314 1.64157 7.26314 2.98024V3.78945H3.21709C1.87841 3.78945 0.789459 4.87841 0.789459 6.21709V24.0197C0.789459 25.3584 1.87841 26.4473 3.21709 26.4473H14.546C15.8847 26.4473 16.9737 25.3584 16.9737 24.0197V23.2105H21.0197C22.3584 23.2105 23.4474 22.1216 23.4474 20.7829C23.4474 20.7829 23.4474 7.70281 23.4474 7.69801C23.4474 7.35731 23.3714 7.03064 23.2362 6.72916ZM20.6847 6.21709H18.5921C18.1456 6.21709 17.7829 5.85437 17.7829 5.40788V3.31531L20.6847 6.21709ZM15.3552 24.0197C15.3552 24.4662 14.9925 24.8289 14.546 24.8289H3.21709C2.771 24.8289 2.40788 24.4662 2.40788 24.0197V6.21709C2.40788 5.7706 2.771 5.40788 3.21709 5.40788H9.69077V8.64472C9.69077 9.98339 10.7797 11.0723 12.1184 11.0723H15.3552V24.0197ZM14.211 9.45393H12.1184C11.6723 9.45393 11.3092 9.09121 11.3092 8.64472V6.55215L14.211 9.45393ZM21.0197 21.5921H16.9737C16.9737 21.5921 16.9737 10.9363 16.9737 10.9333C16.9737 10.3177 16.704 9.65837 16.2624 9.21686L11.5463 4.50068C11.0968 4.05121 10.4649 3.78945 9.82946 3.78945C9.82946 3.78945 8.88156 3.78945 8.88156 3.78945V2.98024C8.88156 2.53375 9.24468 2.17103 9.69077 2.17103H16.1645V5.40788C16.1645 6.74655 17.2534 7.83551 18.5921 7.83551H21.8289V20.7829C21.8289 21.2294 21.4662 21.5921 21.0197 21.5921Z" fill="#6F767E" />
                                </svg>
                                Paste
                            </button>
                            <span className="tooltip-text">Paste Text</span>
                        </div>

                    </div>
                    <button className={styles.turnitGencontainerbutton}>{fetchPlan()}</button>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <textarea
                                placeholder="Enter your text here..."
                                value={text}
                                onChange={handleTextChange}
                                rows="4"
                                className={styles.turnitGencontainertextarea}
                            // required
                            />
                            <div className={styles.turnitGenCounter}>
                                <div className={styles.countText}>
                                    {charCount} character{charCount !== 1 ? 's' : ''} | {wordCount} word{wordCount !== 1 ? 's' : ''}
                                </div>
                                {(plan_id == -3 || plan_id == -1) ? (
                                    <div className="plan-expired">
                                        Plan Expired <MdDoNotDisturb size={16} />
                                    </div>
                                ) : (
                                    <button type='submit' className={styles.turnitgenerateButton}>
                                        Generate
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M13.2929 17.7929C12.9024 18.1834 12.9024 18.8166 13.2929 19.2071C13.6834 19.5976 14.3166 19.5976 14.7071 19.2071L20.5 13.4142C21.281 12.6332 21.281 11.3668 20.5 10.5858L14.7071 4.79289C14.3166 4.40237 13.6834 4.40237 13.2929 4.79289C12.9024 5.18342 12.9024 5.81658 13.2929 6.20711L18.0858 11H4C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H18.0858L13.2929 17.7929Z" fill="#FCFCFC" />
                                        </svg>
                                    </button>)}
                            </div>
                        </div>
                        {/* <Toaster /> */}
                    </form>
                </div>
            ) : (
                // Second container
                <div className={styles.turnitGencontainerSecond}>
                    <div className={styles.turnitGenPaste}>
                        <button className={styles.turnitGenPastepadiback} onClick={handleBack}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                <path d="M8.03033 5.20794C8.32322 4.91505 8.32322 4.44018 8.03033 4.14728C7.73744 3.85439 7.26256 3.85439 6.96967 4.14728L2.625 8.49195C2.03921 9.07774 2.03921 10.0275 2.625 10.6133L6.96967 14.9579C7.26256 15.2508 7.73744 15.2508 8.03033 14.9579C8.32322 14.665 8.32322 14.1902 8.03033 13.8973L4.43566 10.3026H15C15.4142 10.3026 15.75 9.96683 15.75 9.55261C15.75 9.1384 15.4142 8.80261 15 8.80261H4.43566L8.03033 5.20794Z" fill="#FCFCFC" />
                            </svg>
                            Back
                        </button>
                        <h2 className={styles.heading}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                <g clipPath="url(#clip0_995_414)">
                                    <path d="M15.7507 3.78005L12.3608 0.573028C12.0003 0.231907 11.5283 0.0440674 11.032 0.0440674H4.57812C3.51194 0.0440674 2.64453 0.911478 2.64453 1.97766V16.1105C2.64453 17.1767 3.51194 18.0441 4.57812 18.0441H14.4219C15.4881 18.0441 16.3555 17.1767 16.3555 16.1105V5.18468C16.3555 4.65562 16.135 4.14364 15.7507 3.78005ZM14.7264 4.26282H12.1016C12.0046 4.26282 11.9258 4.18396 11.9258 4.08704V1.6133L14.7264 4.26282ZM14.4219 16.9894H4.57812C4.0935 16.9894 3.69922 16.5951 3.69922 16.1105V1.97766C3.69922 1.49303 4.0935 1.09875 4.57812 1.09875H10.8711V4.08704C10.8711 4.76552 11.4231 5.3175 12.1016 5.3175H15.3008V16.1105C15.3008 16.5951 14.9065 16.9894 14.4219 16.9894Z" fill="#F4F4F5" />
                                    <path d="M13.2617 7.07532H5.52734C5.23611 7.07532 5 7.31143 5 7.60266C5 7.8939 5.23611 8.13 5.52734 8.13H13.2617C13.553 8.13 13.7891 7.8939 13.7891 7.60266C13.7891 7.31143 13.553 7.07532 13.2617 7.07532Z" fill="#F4F4F5" />
                                    <path d="M13.2617 9.88782H5.52734C5.23611 9.88782 5 10.1239 5 10.4152C5 10.7064 5.23611 10.9425 5.52734 10.9425H13.2617C13.553 10.9425 13.7891 10.7064 13.7891 10.4152C13.7891 10.1239 13.553 9.88782 13.2617 9.88782Z" fill="#F4F4F5" />
                                    <path d="M8.08391 12.7003H5.52734C5.23611 12.7003 5 12.9364 5 13.2277C5 13.5189 5.23611 13.755 5.52734 13.755H8.08391C8.37514 13.755 8.61125 13.5189 8.61125 13.2277C8.61125 12.9364 8.37514 12.7003 8.08391 12.7003Z" fill="#F4F4F5" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_995_414">
                                        <rect width="18" height="18" fill="white" transform="translate(0.5 0.0441895)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            Generate
                        </h2>
                        <button onClick={handleEraseClick} className={styles.turnitGeners}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                <g clipPath="url(#clip0_738_711)">
                                    <path d="M24.1624 2.83764C23.9725 2.64846 23.7154 2.54224 23.4474 2.54224C23.1794 2.54224 22.9223 2.64846 22.7324 2.83764L17.9684 7.60164L17.6484 7.28864C16.8047 6.46459 15.6973 5.96473 14.5212 5.8771C13.3451 5.78948 12.1759 6.11972 11.2194 6.80964C9.83893 7.85064 8.30446 8.66983 6.67139 9.23764L4.59739 9.84564C3.92343 10.0435 3.29832 10.3801 2.7622 10.8339C2.22609 11.2877 1.79083 11.8486 1.48439 12.4806C1.18299 13.1041 1.01513 13.7836 0.991534 14.4757C0.967943 15.1677 1.08915 15.8571 1.34739 16.4996C2.32617 18.9024 4.0041 20.9558 6.16371 22.3936C8.32332 23.8315 10.865 24.5875 13.4594 24.5636H14.3834C14.5901 24.5635 14.7919 24.5 14.9614 24.3816C16.7216 23.2327 18.2259 21.7331 19.3805 19.9765C20.535 18.22 21.3149 16.2442 21.6714 14.1726C21.7954 13.3805 21.7282 12.5703 21.4755 11.8094C21.2227 11.0485 20.7917 10.3591 20.2184 9.79864L19.4184 9.01464L24.1654 4.26764C24.3542 4.07738 24.4599 3.82005 24.4593 3.55202C24.4587 3.28399 24.352 3.02711 24.1624 2.83764ZM14.0554 22.5376H13.4554C11.9778 22.5397 10.5142 22.2519 9.14739 21.6906L9.15839 21.6846C10.9073 20.8071 12.4045 19.4995 13.5094 17.8846L14.0274 17.1236C14.1783 16.9022 14.2351 16.6299 14.1852 16.3665C14.1353 16.1032 13.9828 15.8705 13.7614 15.7196C13.5399 15.5687 13.2676 15.512 13.0043 15.5619C12.741 15.6117 12.5083 15.7642 12.3574 15.9856L11.8394 16.7466C10.9266 18.0782 9.69064 19.1562 8.24739 19.8796L6.99639 20.5096C5.99551 19.8061 5.12198 18.937 4.41339 17.9396C6.05237 17.3882 7.54769 16.4781 8.79039 15.2756C8.98214 15.0881 9.09155 14.8321 9.09455 14.564C9.09755 14.2958 8.9939 14.0374 8.80639 13.8456C8.61888 13.6539 8.36288 13.5445 8.0947 13.5415C7.82652 13.5385 7.56814 13.6421 7.37639 13.8296C6.25727 14.914 4.89142 15.7102 3.39639 16.1496C3.33539 16.0146 3.26939 15.8826 3.21439 15.7436C3.05951 15.3633 2.98701 14.9544 3.00166 14.544C3.01631 14.1336 3.11778 13.731 3.29939 13.3626C3.48324 12.9844 3.74398 12.6487 4.06494 12.377C4.3859 12.1053 4.76002 11.9036 5.16339 11.7846L7.23639 11.1766C8.43934 10.7902 9.59003 10.2568 10.6624 9.58864L18.5774 17.3006C17.5257 19.3941 15.9722 21.1947 14.0554 22.5416V22.5376ZM19.6754 13.8546C19.5989 14.3225 19.4958 14.7856 19.3664 15.2416L12.3954 8.45264C12.9068 8.08507 13.5206 7.88712 14.1504 7.88664C14.9295 7.88565 15.6778 8.19052 16.2344 8.73564L18.8034 11.2446C19.1464 11.5795 19.4044 11.9913 19.5561 12.446C19.7078 12.9007 19.7487 13.385 19.6754 13.8586V13.8546Z" fill="#6F767E" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_738_711">
                                        <rect width="24" height="24" fill="white" transform="translate(0.447388 0.552612)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            Clear
                        </button>
                    </div>

                    <div className={styles.turnitgenrestbg}>
                        <div className={styles.turnitgenrestab}>
                            <h4>{nextInput ? nextInput : text}</h4>
                            <p>AB</p>
                        </div>
                        <div className={styles.turnitgenrestResult}>
                            <div className={styles.tgenrestRimg}>
                                <Image src="/images/gen-result.svg" alt="Open Menu" width={24} height={24} />
                                <h4>Result</h4>
                            </div>
                            <div className={styles.tgenrestResultxt}>
                                {/* Display loader while loading, otherwise display content */}
                                {loading ? (
                                    // <div className="ml-loader">
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    // </div>
                                    <div className="space-y-2 pl-[48px] my-[30px]">
                                        <Skeleton className="h-4 w-[100%]" />
                                        <Skeleton className="h-4 w-[70%]" />
                                        <Skeleton className="h-4 w-[50%]" />
                                        <Skeleton className="h-4 w-[80%]" />
                                        <Skeleton className="h-4 w-[100%]" />
                                        <Skeleton className="h-4 w-[60%]" />
                                    </div>
                                ) : (
                                    <div className={styles.tgenrestResultxtparagraph}>{fineData}</div>
                                )}
                            </div>
                            <div className={styles.tgenrestResulcopyrefresh}>
                                <button className={styles.tgenrestResulcopy} onClick={handleCopyClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                        <g clipPath="url(#clip0_738_729)">
                                            <path d="M10 13.4386H3.33333C2.4496 13.4375 1.60237 13.086 0.97748 12.4611C0.352588 11.8362 0.00105857 10.989 0 10.1053L0 3.43859C0.00105857 2.55486 0.352588 1.70763 0.97748 1.08274C1.60237 0.457843 2.4496 0.106314 3.33333 0.105255L10 0.105255C10.8837 0.106314 11.731 0.457843 12.3559 1.08274C12.9807 1.70763 13.3323 2.55486 13.3333 3.43859V10.1053C13.3323 10.989 12.9807 11.8362 12.3559 12.4611C11.731 13.086 10.8837 13.4375 10 13.4386ZM3.33333 1.43859C2.8029 1.43859 2.29419 1.6493 1.91912 2.02437C1.54405 2.39945 1.33333 2.90816 1.33333 3.43859V10.1053C1.33333 10.6357 1.54405 11.1444 1.91912 11.5195C2.29419 11.8945 2.8029 12.1053 3.33333 12.1053H10C10.5304 12.1053 11.0391 11.8945 11.4142 11.5195C11.7893 11.1444 12 10.6357 12 10.1053V3.43859C12 2.90816 11.7893 2.39945 11.4142 2.02437C11.0391 1.6493 10.5304 1.43859 10 1.43859H3.33333ZM16 12.7719V4.10526C16 3.92844 15.9298 3.75888 15.8047 3.63385C15.6797 3.50883 15.5101 3.43859 15.3333 3.43859C15.1565 3.43859 14.987 3.50883 14.8619 3.63385C14.7369 3.75888 14.6667 3.92844 14.6667 4.10526V12.7719C14.6667 13.3024 14.456 13.8111 14.0809 14.1861C13.7058 14.5612 13.1971 14.7719 12.6667 14.7719H4C3.82319 14.7719 3.65362 14.8422 3.5286 14.9672C3.40357 15.0922 3.33333 15.2618 3.33333 15.4386C3.33333 15.6154 3.40357 15.785 3.5286 15.91C3.65362 16.035 3.82319 16.1053 4 16.1053H12.6667C13.5504 16.1042 14.3976 15.7527 15.0225 15.1278C15.6474 14.5029 15.9989 13.6557 16 12.7719Z" fill="#84888C" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_738_729">
                                                <rect width="16" height="16" fill="white" transform="translate(0 0.105255)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                                <button className={styles.tgenrestResulreferesh} onClick={handleRefreshClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                        <g clipPath="url(#clip0_738_731)">
                                            <path d="M14.9605 8.09728C14.4559 8.10175 14.0318 8.47769 13.9669 8.97815C13.4861 12.2631 10.4333 14.5363 7.14841 14.0555C3.86348 13.5747 1.59026 10.522 2.07105 7.23706C2.55184 3.95212 5.60457 1.67891 8.88951 2.15969C10.0092 2.32357 11.06 2.8002 11.9208 3.53477L11.1668 4.28886C10.9062 4.54949 10.9062 4.97204 11.1669 5.23261C11.2925 5.35817 11.463 5.42849 11.6405 5.42799H14.7009C15.0695 5.42799 15.3682 5.12922 15.3682 4.76067V1.7003C15.3681 1.33175 15.0693 1.03305 14.7008 1.03311C14.5239 1.03314 14.3542 1.10343 14.2291 1.22849L13.3402 2.11737C10.0332 -0.812525 4.9772 -0.506848 2.04727 2.80017C-0.882654 6.10719 -0.576914 11.1632 2.73007 14.0931C6.03706 17.0231 11.0931 16.7174 14.023 13.4103C15.0544 12.2462 15.7241 10.8066 15.9501 9.26778C16.0386 8.71686 15.6637 8.19851 15.1128 8.11004C15.0624 8.10194 15.0115 8.09769 14.9605 8.09728Z" fill="#84888C" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_738_731">
                                                <rect width="16" height="16" fill="white" transform="translate(0 0.105255)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                            </div>
                            <div className={styles.turnitgenaiques}>
                                <div className={styles.turnitgenaimagic}>
                                    <Image src="/images/magic-ai.svg" alt="Open Menu" width={24} height={24} />
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        placeholder="Ask AI a question or make a request....."
                                        className={styles.turnitGencontainerinput}
                                        value={nextInput}
                                        onChange={(e) => setNextInput(e.target.value)}
                                    />
                                    {(plan_id == -3 || plan_id == -1) ? (
                                        <div className={`plan-expired small-btn ${styles.turnitGeninputbtn}`}>
                                            Plan Expired <MdDoNotDisturb size={16} />
                                        </div>
                                    ) : (
                                        <button className={styles.turnitGeninputbtn}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                                <path d="M17.7929 10.8123C18.1834 11.2029 18.8166 11.2029 19.2071 10.8123C19.5976 10.4218 19.5976 9.78864 19.2071 9.39812L13.4142 3.60522C12.6332 2.82418 11.3668 2.82417 10.5858 3.60522L4.79289 9.39812C4.40237 9.78864 4.40237 10.4218 4.79289 10.8123C5.18342 11.2029 5.81658 11.2029 6.20711 10.8123L11 6.01944L11 20.1052C11 20.6575 11.4477 21.1052 12 21.1052C12.5523 21.1052 13 20.6575 13 20.1052L13 6.01944L17.7929 10.8123Z" fill="#FCFCFC" />
                                            </svg>
                                        </button>)}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* <Toaster /> */}
        </div>
    );
};

export default Generate;
