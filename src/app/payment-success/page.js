"use client";
import DecodeTokenEmail from '@/utils/DecodeTokenEmail';
import FetchUserDetails from '@/utils/FetchUserDetails';
import { useEffect, useState } from 'react';
import styles from "./page.module.css"
import { Image } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

const PaymentSuccess = () => {
  const [sessionData, setSessionData] = useState(null);
  const [hasSaved, setHasSaved] = useState(false);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("")
  const router = useRouter();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // if (typeof window != 'undefined') { // Check if running in the browser
      const tempId = localStorage.getItem("userId")
      const tempemail = localStorage.getItem("email");
      setUserId(tempId);
      setEmail(tempemail)
    // }
}, []);



  const updateUser = async (newPlan, subscription_id) => {
   
    const body = {
      email: email,
      plan_id: newPlan,
      subscription: [subscription_id]
    };

    console.log("Request body:", body);

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const rawText = await response.text(); // Raw response
      console.log("Raw response:", rawText);

      const data = JSON.parse(rawText);
      console.log("Parsed response:", data);

      if (!response.ok) {
        console.error("API Error:", data.error);
      } else {
        localStorage.setItem("plan_id", newPlan);
        console.log("User updated successfully:", data.user);
      }
    } catch (error) {
      console.log("Unexpected error occurred:", error.message);
    }
  };



  useEffect(() => {

    const fetchSessionData = async () => {
      // setLoading(false);
      // return
      try {
        const sessionId = new URLSearchParams(window.location.search).get('session_id');
        // Log or use the fetched parameters as needed
        if (!sessionId) {
          console.log("Session ID not found in URL");
          return;
        }

        const response = await fetch(`/api/payment-success?session_id=${sessionId}`);

        if (!response.ok) {
          console.log('Failed to fetch session data');
          return;
        }

        const data = await response.json();
        console.log("Fetched session data:", data);

        if (data) {
          setSessionData(data);
        } else {
          console.log("Incomplete session data received:", data);
        }
      } catch (error) {
        console.log('Error fetching session data:', error);
      }
      finally {
        setLoading(false);
        setTimer(5)
      }
    };

    fetchSessionData();
  }, []);

  const fetchPrompt = (id) => {
      switch (id) {
        case 1:
          return 50;
        case 2: 
        return 100;

        case 4: 
          return 600;

        case 5: 
        return 1200;
      
        default:
          return -1;
      }
  }

  // Create and save subscription data only once after sessionData is set
  useEffect(() => {
    if (sessionData && !hasSaved) {
      const price = new URLSearchParams(window.location.search).get('price'); // Fetch price from URL
      const planType = new URLSearchParams(window.location.search).get('planType'); // Fetch planType from URL
      const expired_at = new URLSearchParams(window.location.search).get('expired_at');
      const id = new URLSearchParams(window.location.search).get('id');

      const subscriptionData = {
        userId: userId,
        email: email,
        name: sessionData?.customer_details?.name,
        paymentIntentId: sessionData?.invoice,
        paymentStatus: sessionData?.payment_status,
        sessionId: sessionData?.id,
        customerEmail: sessionData?.customer_details?.email || sessionData?.customer_email,
        totalAmount: sessionData?.amount_total,
        currency: sessionData?.currency,
        createdTimestamp: sessionData?.created,
        price: price,
        planType: planType,
        plan_expired: expired_at,
        created_at: new Date(),
        plan_id: id,
        customerId: sessionData?.customer,
        subscription: sessionData?.subscription
      };

      const saveSubscriptionData = async () => {
        try {
          const saveResponse = await fetch('/api/save-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscriptionData),
          });

          const saveResult = await saveResponse.json();
          if (saveResponse.ok) {
            updateUser(id, sessionData?.subscription, saveResult.prompt) 
            setHasSaved(true); // Set flag to prevent duplicate saves
          } else {
            console.log("Failed to save subscription front:", saveResult.error);
          }
        } catch (error) {
          console.log("Error saving subscription:", error);
        }
      };

      saveSubscriptionData();
    }
  }, [sessionData, hasSaved]);



  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (timer == null) {
      return;
    }
    const clockTime = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(clockTime);
          router.push('/dashboard/transactions');
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(clockTime); // Cleanup on unmount
  }, [timer]);

  return (
    <>

      <div className={styles.paymentPageMsg}>
        {loading ? (
          <div className="ml-loader ml-loader-humanizer">
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
            <div></div>
          </div>) :
          <div className={styles.payemntDiv}>
            <div className={styles.turnitLogo}>
              <Image src='/images/turnit-logo.svg' />
            </div>
            <svg width="86" height="86" viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="86" height="86" rx="41.9512" fill="#0AB27D" />
              <path d="M59.7797 30.4152L36.7066 53.4883L26.2188 43.0005" stroke="white" stroke-width="5.2439" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <h1 className={styles.paymentHead}>Payment Success</h1>
            {sessionData && (
              <div className={styles.paymentInfo}>
                <h2>Thank you for your payment!</h2>
                <p>Payment Status: {sessionData?.payment_status}</p>
                <p>Total Amount: {(sessionData?.amount_total / 100).toFixed(2)} {sessionData?.currency?.toUpperCase()}</p>
                <p>Tranasaction ID: {sessionData?.invoice}</p>
                <br />
                <br />
                <p>Redirecting to Transactions History...</p>
                <p>Please wait...{timer}</p>
              </div>
            )}
          </div>}
      </div>
    </>)
};

export default PaymentSuccess;
