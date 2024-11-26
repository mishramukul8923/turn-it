"use client";
import DecodeTokenEmail from '@/utils/DecodeTokenEmail';
import FetchUserDetails from '@/utils/FetchUserDetails';
import { useEffect, useState } from 'react';
import styles from "./page.module.css"
import { Image } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';

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

  const fetchPrompt = (id) => {
    switch (id) {
      case "1":
        return 50;
      case "2":
        return 100;
      case "4":
        return 600;
      case "5":
        return 1200;
      default:
        return -99;
    }
  }



  const updateUser = async (newPlan, subscription_id, expiry) => {

    const body = {
      email: email,
      plan_id: newPlan,
      subscription: [subscription_id],
      prompt: fetchPrompt(newPlan),
      expired_at: expiry
    };


    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const rawText = await response.text(); // Raw response

      const data = JSON.parse(rawText);

      if (!response.ok) {
        console.error("API Error:", data.error);
      } else {
        localStorage.setItem("plan_id", newPlan);
        localStorage.setItem("my_prompt", body.prompt || 0);
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


  // Create and save subscription data only once after sessionData is set
  useEffect(() => {
    if (sessionData && !hasSaved) {
      const price = new URLSearchParams(window.location.search).get('price'); // Fetch price from URL
      const planType = new URLSearchParams(window.location.search).get('planType'); // Fetch planType from URL
      const expired_at = new URLSearchParams(window.location.search).get('expired_at');
      const id = new URLSearchParams(window.location.search).get('id');
      setAddKey(id == '3' ? true : false)


      // localStorage.setItem("plan_id", id);
      // localStorage.setItem("my_prompt", fetchPrompt(id) || 0);
      // return;

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
        subscription: sessionData?.subscription,
        prompt: fetchPrompt(id),
      };



      const saveSubscriptionData = async () => {
        // return
        try {
          const saveResponse = await fetch('/api/save-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscriptionData),
          });

          const saveResult = await saveResponse.json();
          if (saveResponse.ok) {
            updateUser(id, sessionData?.subscription, saveResult.expiry)
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
  const [addKey, setAddKey] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // useEffect(() => {
  //   if (!dialogOpen) {
  //     setAddKey(false);
  //   }
  // }, [dialogOpen])

  useEffect(() => {
    // if (addKey) {
    //   setDialogOpen(true);
    //   return
    // }
    if (timer == null) {
      return;
    }
    const clockTime = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(clockTime);
          router.push('/dashboard/account');
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(clockTime); // Cleanup on unmount
  }, [timer, addKey]);

  const [cloudKey, setCloudKey] = useState('')

  const saveCloudKey = async () => {
    const body = {
      userId: localStorage.getItem("userId"),
      cloudKey: cloudKey
    }
    try {
      const saveResponse = await fetch('/api/apiKeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const saveResult = await saveResponse.json();
      if (saveResponse.ok) {
        setAddKey(false);
        toast({
          title: "Success",
          description: "API keys updated successfully.",
          variant: 'success',
          style: {
            backgroundColor: "black",
          }
        });
        setDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to save API keys.",
          variant: "destructive",
        });

      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  }

  return (
    <>

      <Head>
        <title>Payment Successful | TurnIt</title>
        <meta name="description" content="Your payment has been successfully processed. Thank you for subscribing to TurnIt!" />
        <meta name="keywords" content="TurnIt, payment successful, subscription, payment confirmation" />
        <meta name="author" content="TurnIt Team" />

        {/* <!-- Open Graph Meta Tags for Social Media Sharing --> */}
        <meta property="og:title" content="Payment Successful | TurnIt" />
        <meta property="og:description" content="Your payment has been successfully processed. Thank you for subscribing to TurnIt!" />
        <meta property="og:url" content="https://turnit.vercel.app/payment-success" />
        <meta property="og:image" content="https://turnit.vercel.app/images/payment-success-image.png" />
        <meta property="og:type" content="website" />

        {/* <!-- Twitter Card Meta Tags --> */}
        <meta name="twitter:title" content="Payment Successful | TurnIt" />
        <meta name="twitter:description" content="Your payment has been successfully processed. Thank you for subscribing to TurnIt!" />
        <meta name="twitter:image" content="https://turnit.vercel.app/images/payment-success-image.png" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* <!-- Favicon --> */}
        <link rel="icon" href="https://turnit.vercel.app/favicon.ico" />
      </Head>


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
              <path d="M59.7797 30.4152L36.7066 53.4883L26.2188 43.0005" stroke="white" strokeWidth="5.2439" stroke-linecap="round" stroke-linejoin="round" />
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
                <p>Redirecting to Account Dashboard...</p>
                <p>Please wait...{timer}</p>
              </div>
            )}
          </div>}
      </div>
      <div>
        {/* <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cloud Key</DialogTitle>
              <DialogDescription>
                Enter Cloud Key Here.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="apiKey" className="text-left">
                  API Key
                </Label>
                <Input
                  id="apiKey"
                  placeholder="Enter Api Key"
                  className="w-full"
                  onChange={(e) => { setCloudKey(e.target.value) }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => { saveCloudKey() }}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}

      </div>
    </>)
};

export default PaymentSuccess;
