"use client";
import { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import { Image } from "react-bootstrap";
import DecodeTokenEmail from "@/utils/DecodeTokenEmail";
import FetchUserDetails from "@/utils/FetchUserDetails";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdDoNotDisturb } from "react-icons/md";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton"




const Humanizer = ({ fetchData }) => {
  const [plan_id, setPlan_id] = useState("");
  const [text, setText] = useState("");
  const [isSecondContainerVisible, setIsSecondContainerVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [humanizedData, setHumanizedData] = useState("");
  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); // Using ShadCN toast
  const [copied ,setCopied] =useState(false)
  const [regenerated ,setRegenerated] =useState(false);
  const [saveContentId, setSavedContentId]= useState(null);
  const [userId, setUserId] = useState(null);
  const [apiKeys, setapikeys] = useState({
    gptZeroApiKey:null,
    zeroGptApiKey:null,
    originalityApiKey:null,
    copyLeaksApiKey:null
  })
  const router = useRouter();







  const user_id = localStorage.getItem("userId");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setUserId(userId);
    setPlan_id(localStorage.getItem("plan_id"));
    if (localStorage.getItem("keyword")) {
      fetchHisrotyData();
    }
  }, [fetchData]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleEraseClick = () => {
    setIsSecondContainerVisible(false);
  };

  let wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  let charCount = text.length;

  const togglePlanhumanize = () => {
    setIsActive(!isActive);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();

    if (plan_id === "-2" || plan_id === "-1") {
      return;
    }
    if (wordCount < 30) {
      toast({
        title: "Error",
        description: "Input words should be more than 30 words.",
        variant: "destructive",
      });
      return;
    }
    else{
      setIsSecondContainerVisible(true);
      await fetchRewriteData();
    }
  };

  const fetchHisrotyData = async () => {
    try {
      const data = JSON.parse(localStorage.getItem("keyword"));
      if (!data) return;
      const { createdId, title } = data;

      if (createdId && title) {
        setText(title);
        const response = await fetch(`/api/history/humanizer/${user_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch history data");
        }

        const responseData = await response.json();
        const filteredData = responseData.filter((item) =>
             item.text === title && item.createdAt === createdId
        );

        setHumanizedData(filteredData[0]?.humanizedContent);
        setIsSecondContainerVisible(true);

        localStorage.removeItem("keyword");
      }
    } catch (err) {
      console.log("Error fetching history:", err);
      localStorage.removeItem("keyword");
    }
  };

  const fetchRewriteData = async () => {
    setLoading(true);
    setHumanizedData("");
    try {
      const response = await fetch("https://qaiegn55pb.us-east-1.awsapprunner.com/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "9816000016",
        },
        body: JSON.stringify({ content: text, expected_word_count: wordCount }),
      });

      if (!response.ok) {
        toast({
          title: 'Error',
          description: 'Something Went Wrong, Please Try Again.',
          variant: 'error',
        });
      }

      const result = await response.json();
      console.log("this is humanized result, ", result);
      setHumanizedData(result.content[0].text);
      toast({
        title: "Success",
        description: "Text successfully humanized.",
        variant: 'success',
        style: {
          backgroundColor: "black",
        }
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

 



  useEffect(() => {
    if (humanizedData) {
      const timer = setTimeout(() => {
        handleSaveContent();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [humanizedData]);

  const handleSaveContent = async () => {
    const token = localStorage.getItem("token");
    const email = DecodeTokenEmail(token);

    try {
      const response = await fetch("/api/humanizedContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          humanizedContent: humanizedData,
          user_id,
          email,
          copied,
          regenerated,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSavedContentId(result.data?.insertedId);
        setPlan_id(result?.data?.plan_id);
        localStorage.setItem("plan_id", result?.data?.plan_id);
      } else {
        console.log("Failed to save data");
      }
    } catch (error) {
      console.log("Error saving data:", error);
      toast({
        title: "Error",
        description: "Error saving data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePasteText = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.log("Failed to read clipboard contents:", err);
    }
  };


  



  const handleCopyClick = () => {
    setCopied(true)
    navigator.clipboard
      .writeText(humanizedData)
      .then(() =>
        toast({
          title: "Success",
          description: "Text copied to clipboard!",
        })
      )
      .catch((err) => console.log("Failed to copy text: ", err));
      // saveCopied(true)
      
  };




  const saveCopied = async () => {
    console.log("copied function is running")
    try {
      const res = await fetch('/api/humanizedContent', {
        method: 'PATCH', // Fix: 'PATCH' should be a string
        headers: {
          "Content-Type": "application/json", // Fix: Corrected key casing
        },
        body: JSON.stringify({
          saveContentId,
          copied,
          regenerated,
        }),
      });
  
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }
  
      const data = await res.json();
      console.log("Save successful:", data);
    } catch (error) {
      console.log("Failed to save data:", error);
    }
  };
  
  useEffect(()=>{
    if(copied || regenerated){
      saveCopied()
    }
    
  },[copied, regenerated])


  
//   async function fetchApiKey() {
//     const apiKeyId = '672daf0549f3b3dcda8d069b'; // Replace with the actual ID
//     const url = `/api/apiKeys/${apiKeyId}`;

//     try {
//         const response = await fetch(url, {
//             method: 'GET', // Default for fetching
//             headers: {
//                 'Content-Type': 'application/json', // Ensure the server knows we're expecting JSON
//             },
//         });

//         if (!response.ok) {
//             throw new Error(`Error fetching API key: ${response.status} ${response.statusText}`);
//         }

//         const data = await response.json();
//         setapikeys((prevKeys) => ({
//           ...prevKeys,
//           gptZeroApiKey: data.data.gptZeroApiKey,
//           zeroGptApiKey: data.data.zeroGptApiKey,
//           originalityApiKey:data.data.originalityApiKey,
//           copyLeaksApiKey: data.data.copyLeaksApiKey,
//       }));
//         console.log('Fetched API Key Data:', data);
//         return data;
//     } catch (error) {
//         console.log('Failed to fetch API key:', error);
//         return null;
//     }
// }

// // Call the function
// useEffect(()=>{
//     if(userId){
//         fetchApiKey()
//     }
   

// },[userId])

// useEffect(()=>{
//   console.log("this api key", apiKeys)
// },[apiKeys])







  const handleRegenerateClick = async () => {
    setError("");
    await fetchRewriteData();
     setRegenerated(true)
  };

    const handleBack = () => {
        router.back();
    };



    return (
        <div className={styles.turnitGencontainer}>
            {/* First Container */}
            <div className={styles.turnitGencontainerFirst}>
                <div className={`${styles.turnitGenPaste} ${styles.turnitGenPastepadi}`}>
                    <div>
                        <button className={styles.turnitGenPastepadiback} onClick={handleBack}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                <path d="M8.03033 5.20794C8.32322 4.91505 8.32322 4.44018 8.03033 4.14728C7.73744 3.85439 7.26256 3.85439 6.96967 4.14728L2.625 8.49195C2.03921 9.07774 2.03921 10.0275 2.625 10.6133L6.96967 14.9579C7.26256 15.2508 7.73744 15.2508 8.03033 14.9579C8.32322 14.665 8.32322 14.1902 8.03033 13.8973L4.43566 10.3026H15C15.4142 10.3026 15.75 9.96683 15.75 9.55261C15.75 9.1384 15.4142 8.80261 15 8.80261H4.43566L8.03033 5.20794Z" fill="#FCFCFC" />
                            </svg>
                            Back
                        </button>
                    </div>
                    <h2 className={styles.heading}>
                        <Image src="/images/thumb.svg" alt="Open Menu" fluid />
                        Humanizer
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
                <div>
                    <form onSubmit={handelSubmit}>
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
                            {(plan_id == -2 || plan_id == -1) ? (
                                <div className="plan-expired">
                                    Plan Expired <MdDoNotDisturb size={16} />
                                </div>
                            ) : (
                                <button type="submit" className={styles.turnitgenerateButton}>
                                    Humanize
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M13.2929 17.7929C12.9024 18.1834 12.9024 18.8166 13.2929 19.2071C13.6834 19.5976 14.3166 19.5976 14.7071 19.2071L20.5 13.4142C21.281 12.6332 21.281 11.3668 20.5 10.5858L14.7071 4.79289C14.3166 4.40237 13.6834 4.40237 13.2929 4.79289C12.9024 5.18342 12.9024 5.81658 13.2929 6.20711L18.0858 11H4C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H18.0858L13.2929 17.7929Z" fill="#FCFCFC" />
                                    </svg>
                                </button>)}
                        </div>
                        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
                    </form>
                </div>
            </div>

            {/* Second Container */}
            {isSecondContainerVisible && (
                <div className='turnitHumanizerPercentbg'>
                    <div className='turnitHumanizerPercentright'>
                        <h2>Humanized Text</h2>
                        <div className='thprNumber'>
                            <h4>75%</h4>
                            <h5>Of text is likely Humanized</h5>
                            <h5>Confidence: High</h5>
                            <p>1,070,992/216,000 Credits left</p>
                        </div>
                    </div>
                    <div className='turnitHumanizerPercentleft'>
                        <div className='thplscanbg'>
                            {/* 1 */}
                            <button className='thplscan'>
                                <div className='thplscanimgfirst'>
                                    <div className='thplscanimg'>
                                        <Image src="/images/gptzero.svg" alt="Open Menu" fluid />
                                        <p>GPTZero</p>
                                    </div>
                                    <div className='thplscanimgsearch'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                                            <path d="M5.56821 8.33856C7.4693 8.33856 9.01044 6.79742 9.01044 4.89633C9.01044 2.99524 7.4693 1.4541 5.56821 1.4541C3.66712 1.4541 2.12598 2.99524 2.12598 4.89633C2.12598 6.79742 3.66712 8.33856 5.56821 8.33856Z" stroke="white" strokeWidth="0.860558" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9.87071 9.19883L8.02051 7.34863" stroke="white" strokeWidth="0.860558" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Scan
                                    </div>
                                </div>
                                <div className='thplscanclk'>
                                    <p>Click to scan</p>
                                </div>
                            </button>
                            {/* 2 */}


                            <button className='thplscan'>
                                <div className='thplscanimgfirst'>
                                    <div className='thplscanimg'>
                                        <Image src="/images/gptzero.svg" alt="Open Menu" fluid />
                                        <p>GPTZero</p>
                                    </div>
                                    <div className='thplscanimgsearch'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                                            <path d="M5.56821 8.33856C7.4693 8.33856 9.01044 6.79742 9.01044 4.89633C9.01044 2.99524 7.4693 1.4541 5.56821 1.4541C3.66712 1.4541 2.12598 2.99524 2.12598 4.89633C2.12598 6.79742 3.66712 8.33856 5.56821 8.33856Z" stroke="white" strokeWidth="0.860558" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9.87071 9.19883L8.02051 7.34863" stroke="white" strokeWidth="0.860558" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Scan
                                    </div>
                                </div>
                                <div className='thplscanclk'>
                                    <p>Click to scan</p>
                                </div>
                            </button>


                            {/* 3 */}
                            <button className='thplscan'>
                                <div className='thplscanimgfirst'>
                                    <div className='thplscanimg'>
                                        <Image src="/images/gptzero.svg" alt="Open Menu" fluid />
                                        <p>GPTZero</p>
                                    </div>
                                    <div className='thplscanimgsearch'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                                            <path d="M5.56821 8.33856C7.4693 8.33856 9.01044 6.79742 9.01044 4.89633C9.01044 2.99524 7.4693 1.4541 5.56821 1.4541C3.66712 1.4541 2.12598 2.99524 2.12598 4.89633C2.12598 6.79742 3.66712 8.33856 5.56821 8.33856Z" stroke="white" strokeWidth="0.860558" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9.87071 9.19883L8.02051 7.34863" stroke="white" strokeWidth="0.860558" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Scan
                                    </div>
                                </div>
                                <div className='thplscanclk'>
                                    <p>Click to scan</p>
                                </div>
                            </button>
                            {/* 4 */}
                            <button className='thplscan'>
                                <div className='thplscanimgfirst'>
                                    <div className='thplscanimg'>
                                        <Image src="/images/gptzero.svg" alt="Open Menu" fluid />
                                        <p>GPTZero</p>
                                    </div>
                                    <div className='thplscanimgsearch'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                                            <path d="M5.56821 8.33856C7.4693 8.33856 9.01044 6.79742 9.01044 4.89633C9.01044 2.99524 7.4693 1.4541 5.56821 1.4541C3.66712 1.4541 2.12598 2.99524 2.12598 4.89633C2.12598 6.79742 3.66712 8.33856 5.56821 8.33856Z" stroke="white" strokeWidth="0.860558" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9.87071 9.19883L8.02051 7.34863" stroke="white" strokeWidth="0.860558" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Scan
                                    </div>
                                </div>
                                <div className='thplscanclk'>
                                    <p>Click to scan</p>
                                </div>
                            </button>
                        </div>
                        <div className='turnithumanizehighlight'>
                            <div className='turnithumanizehighlightshow'>
                                <div className='thzhlsflex'>
                                    <div className={styles.planTogglechat} onClick={togglePlanhumanize}>
                                        <div className={`${styles.circlechat} ${isActive ? styles.active : ''}`}></div>
                                    </div>
                                    <p>Show Highlights</p>
                                </div>
                                <div className={styles.turnitGenPaste}>
                                    <div className="tooltip-container">
                                        <button onClick={handleCopyClick}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                <g clipPath="url(#clip0_738_1427)">
                                                    <path d="M13.4475 20.5526C14.7731 20.551 16.044 20.0237 16.9813 19.0864C17.9186 18.1491 18.4459 16.8782 18.4475 15.5526V6.79563C18.4491 6.26999 18.3463 5.74927 18.1451 5.26365C17.9439 4.77803 17.6483 4.33717 17.2755 3.96663L15.0335 1.72463C14.663 1.3518 14.2221 1.05623 13.7365 0.85505C13.2509 0.653867 12.7302 0.551074 12.2045 0.55263H7.44751C6.12191 0.554218 4.85107 1.08151 3.91373 2.01885C2.97639 2.95619 2.4491 4.22703 2.44751 5.55263V15.5526C2.4491 16.8782 2.97639 18.1491 3.91373 19.0864C4.85107 20.0237 6.12191 20.551 7.44751 20.5526H13.4475ZM4.44751 15.5526V5.55263C4.44751 4.75698 4.76358 3.99392 5.32619 3.43131C5.8888 2.8687 6.65186 2.55263 7.44751 2.55263C7.44751 2.55263 12.3665 2.56663 12.4475 2.57663V4.55263C12.4475 5.08306 12.6582 5.59177 13.0333 5.96684C13.4084 6.34192 13.9171 6.55263 14.4475 6.55263H16.4235C16.4335 6.63363 16.4475 15.5526 16.4475 15.5526C16.4475 16.3483 16.1314 17.1113 15.5688 17.674C15.0062 18.2366 14.2432 18.5526 13.4475 18.5526H7.44751C6.65186 18.5526 5.8888 18.2366 5.32619 17.674C4.76358 17.1113 4.44751 16.3483 4.44751 15.5526ZM22.4475 8.55263V19.5526C22.4459 20.8782 21.9186 22.1491 20.9813 23.0864C20.044 24.0237 18.7731 24.551 17.4475 24.5526H8.44751C8.18229 24.5526 7.92794 24.4473 7.7404 24.2597C7.55287 24.0722 7.44751 23.8178 7.44751 23.5526C7.44751 23.2874 7.55287 23.0331 7.7404 22.8455C7.92794 22.658 8.18229 22.5526 8.44751 22.5526H17.4475C18.2432 22.5526 19.0062 22.2366 19.5688 21.674C20.1314 21.1113 20.4475 20.3483 20.4475 19.5526V8.55263C20.4475 8.28741 20.5529 8.03306 20.7404 7.84552C20.9279 7.65799 21.1823 7.55263 21.4475 7.55263C21.7127 7.55263 21.9671 7.65799 22.1546 7.84552C22.3422 8.03306 22.4475 8.28741 22.4475 8.55263Z" fill="#6F767E" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_738_1427">
                                                        <rect width="24" height="24" fill="white" transform="translate(0.44751 0.552631)" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            Copy
                                        </button>
                                        <span className="tooltip-text">Copy Text</span>
                                    </div>
                                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
                                </div>
                            </div>

                            <div className='thzhlstextarea'>
                                <div className='thzhlstextareaparagraph'>
                                    {loading ? (
                                           <div className="space-y-3 mt-4">
                                           <Skeleton className="h-4 w-[100%]" />
                                           <Skeleton className="h-4 w-[70%]" />
                                           <Skeleton className="h-4 w-[50%]" />
                                           <Skeleton className="h-4 w-[80%]" />
                                           <Skeleton className="h-4 w-[100%]" />
                                           <Skeleton className="h-4 w-[60%]" />
                                           <Skeleton className="h-4 w-[85%]" />
                                           <Skeleton className="h-4 w-[65%]" />
                                       </div>
                                    ) : (
                                        <pre className={styles.showHumanizedData}>{humanizedData}</pre>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='turnithumanizehighlightcount'>
                            {/* <div className={styles.countText}>
                                {charCount} character{charCount !== 1 ? 's' : ''} | {wordCount} word{wordCount !== 1 ? 's' : ''}
                            </div> */}
                            <div className={styles.countText}>
                                {humanizedData ? (
                                    <>
                                        {humanizedData.length} character{humanizedData.length !== 1 ? 's' : ''} |{' '}
                                        {humanizedData.trim().split(/\s+/).filter(Boolean).length} word{humanizedData.trim().split(/\s+/).filter(Boolean).length !== 1 ? 's' : ''}
                                    </>
                                ) : (
                                    <>
                                        {charCount} character{charCount !== 1 ? 's' : ''} | {wordCount} word{wordCount !== 1 ? 's' : ''}
                                    </>
                                )}
                            </div>
                            {(plan_id == -2 || plan_id == -1) ? (
                                <div className="plan-expired">
                                    Plan Expired <MdDoNotDisturb size={16} />
                                </div>
                            ) : (
                                <button onClick={handleRegenerateClick}>
                                    Regenerate
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M2.99922 14.0898C3.22422 14.0898 3.44697 13.9893 3.59397 13.7973L3.92022 13.3735C4.40847 16.27 6.43722 18.748 9.31722 19.7478C10.2037 20.0553 11.1135 20.203 12.0112 20.203C14.6992 20.203 17.286 18.877 18.8347 16.5423C19.0635 16.1973 18.969 15.7315 18.624 15.5028C18.2775 15.2725 17.814 15.3685 17.5837 15.7135C15.897 18.259 12.6997 19.336 9.80997 18.331C7.41222 17.4985 5.73972 15.4113 5.38272 12.9873L6.02472 13.4815C6.35397 13.7328 6.82422 13.6728 7.07622 13.3443C7.32897 13.0158 7.26822 12.5455 6.93972 12.2928C6.93972 12.2928 5.16597 10.927 5.16147 10.924C4.78872 10.6368 4.25847 10.4755 3.92097 10.9158L2.40597 12.883C2.15322 13.2115 2.21397 13.6818 2.54247 13.9345C2.67822 14.0388 2.83947 14.0898 2.99922 14.0898Z"
                                            fill="white"
                                        />
                                        <path
                                            d="M5.37636 8.49853C5.72061 8.72728 6.18636 8.63278 6.41661 8.28778C8.10336 5.74303 11.3036 4.66603 14.1904 5.67028C16.5881 6.50278 18.2606 8.59003 18.6176 11.014L17.9756 10.5198C17.6464 10.2678 17.1761 10.3278 16.9241 10.657C16.6714 10.9855 16.7321 11.4558 17.0606 11.7085C17.0606 11.7085 18.8344 13.0735 18.8389 13.0773C19.2184 13.369 19.7366 13.5325 20.0794 13.0855L21.5944 11.1183C21.8471 10.7898 21.7864 10.3195 21.4579 10.0668C21.1294 9.81403 20.6584 9.87553 20.4064 10.204L20.0801 10.6278C19.5919 7.73128 17.5631 5.25328 14.6831 4.25353C11.1431 3.02503 7.23111 4.34278 5.16561 7.45828C4.93686 7.80403 5.03136 8.26903 5.37636 8.49853Z"
                                            fill="white"
                                        />
                                    </svg>
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default Humanizer;