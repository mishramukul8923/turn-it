"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../components/dashboard.module.css';
import { loadStripe } from '@stripe/stripe-js';
import DecodeTokenEmail from '@/utils/DecodeTokenEmail';
import { useRouter } from "next/navigation";



const PricingPr = () => {
    const my_plan = localStorage.getItem("plan_id")
    const [text, setText] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    const [userID, setUserID] = useState("")
    const router = useRouter();

    const options = [
        { name: 'Monthly', value: 'monthly' },
        { name: 'Yearly', value: 'yearly' },
    ];

    const handleSubmit = async (planData) => {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

        if (!stripe) {
            console.error('Stripe initialization failed');
            return;
        }

        if (planData.price === 0) {
            window.location.href = '/welcome';
            return;
        }

        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ planData }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error('Payment initiation failed: ' + errorData.message || response.statusText);
            }

            const data = await response.json();
            if (!data.ok) {
                throw new Error('Something went wrong');
            }

            if (data.result && data.result.id) {
                await stripe.redirectToCheckout({
                    sessionId: data.result.id,
                });
            } else {
                console.error('Session ID is missing in the response');
            }
        } catch (error) {
            console.error('Error during payment:', error);
        }
    };

    //   const fetchSubscriptionPlans = async () => {
    //     try {
    //       const response = await fetch('/api/subscriptionPlan');
    //       if (!response.ok) {
    //         throw new Error('Failed to fetch subscription plans');
    //       }
    //       const data = await response.json();
    //       setSubscriptionPlans(data);
    //     } catch (err) {
    //       setError(err.message);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    useEffect(() => {
        // fetchSubscriptionPlans();

        if (typeof window !== undefined) {
            const token = localStorage.getItem('token');
            if (token) {
                const email = DecodeTokenEmail(token);
                setUserEmail(email);
                const user_id = localStorage.getItem('userId');
                setUserID(user_id)
            }
        }
    }, []);

    const starterPlanData = {
        price: 2900,
        email: userEmail,
        planType: "monthly",
        name: subscriptionPlans[0]?.name,
        stripe_price_id: subscriptionPlans[0]?.stripe_price_id,
        trial_days: subscriptionPlans[0]?.trial_days,
        planId: subscriptionPlans[0]?.userId,
    };

    const freePlanData = {
        price: 0,
        email: userEmail,
    };


    const AllPlans = {
        month_basic : {
            id: 1,
            name: "Basic Plan",
            price: 19,
            email: userEmail,
            interval: 'month',
            user_id: userID,
            planType: "monthly_subscription",
            expired_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        month_standard: {
            id: 2,
            name: "Standard Plan",
            price: 49,
            email: userEmail,
            interval: 'month',
            user_id: userID,
            planType: "monthly_subscription",
            expired_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        month_enterprise: {
            id: 3,
            name: "Enterprise Plan",
            price: 99,
            email: userEmail,
            interval: 'month',
            user_id: userID,
            planType: "monthly_subscription",
            expired_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        subscribed_basic: {
            id: 4,
            name: "Basic Plan Subscription",
            price: 180,
            email: userEmail,
            interval: 'year',
            user_id: userID,
            planType: "yearly_subscription",
            expired_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        subscribed_standard: {
            id: 5,
            name: "Standard Plan Subscription",
            price: 468,
            email: userEmail,
            interval: 'year',
            user_id: userID,
            planType: "yearly_subscription",
            expired_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        subscribed_premium: {
            id: 6,
            name: "Premium Plan Subscription",
            price: 1068,
            email: userEmail,
            interval: 'year',
            user_id: userID,
            planType: "yearly_subscription",
            expired_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
    }

    // Toggle between monthly and yearly plans
    const togglePlan = () => {
        setIsActive(!isActive);
    };

    const handleBack = () => {
        router.back();
    };


    return (
        <>
    

        <div className={styles.turnitDashOvervBg}>

            <div className={styles.turnitDashOvervCont}>
                <div className={styles.turnitApiDetectorheadingsrch}>
                    <div>
                        <button className={styles.turnitGenPastepadiback} onClick={handleBack}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                <path d="M8.03033 5.20794C8.32322 4.91505 8.32322 4.44018 8.03033 4.14728C7.73744 3.85439 7.26256 3.85439 6.96967 4.14728L2.625 8.49195C2.03921 9.07774 2.03921 10.0275 2.625 10.6133L6.96967 14.9579C7.26256 15.2508 7.73744 15.2508 8.03033 14.9579C8.32322 14.665 8.32322 14.1902 8.03033 13.8973L4.43566 10.3026H15C15.4142 10.3026 15.75 9.96683 15.75 9.55261C15.75 9.1384 15.4142 8.80261 15 8.80261H4.43566L8.03033 5.20794Z" fill="#FCFCFC" />
                            </svg>
                            Back
                        </button>
                    </div>

                </div>


                <div className={styles.starttextAreaContainer}>
                    <div className={styles.textAreaContainer}>
                        <h2 className={styles.stacHeading}>Pricing Plans</h2>
                        <div className={styles.planStatusContainer}>
                            <span className={styles.limitedText}>{isActive ? 'Monthly' : 'Monthly'}</span>
                            <div className={styles.planToggle} onClick={togglePlan}>
                                <div className={`${styles.circle} ${isActive ? styles.active : ''}`}></div>
                            </div>
                            {/* <span className={styles.planText}>
                                {isActive ? 'Yearly (Unlimited prompts)' : (
                                    <>
                                        Yearly <span className={styles.highlightGreen}>(Get 2 Months Free)</span>
                                    </>
                                )}
                            </span> */}
                            <span className={styles.planText}>
                                {isActive ? 'Yearly' : (
                                    <>
                                        Yearly
                                    </>
                                )}
                            </span>

                        </div>

                        {/* ========== plans new ======== */}

                        <div className={`${styles.pricingPlanSection} ${styles.dashPricingPlanSection}`}>

                            <div className="container">
                                {isActive ? (
                                    // Yearly Plan Content
                                    <div className={styles.yearlyPlanContent}>


                                        {/* {selectedPlan == "monthly" && ( */}
                                        <div className={styles.planCardParent}>
                                            <div className={styles.planCard}>
                                                <div>
                                                    <span className={styles.planTag}>Basic</span>
                                                    <div className={styles.planPrice}>$15 <span>/ month Billed Annually</span></div>
                                                    <p className={styles.planPara}>
                                                        Best for occasional users of ChatGPT or other AI writing tools.
                                                    </p>

                                                    <div className={styles.planType} onClick={(e) => { e.preventDefault(); handleSubmit(AllPlans.subscribed_basic); }}>
                                                        Choose Basic Plan
                                                    </div>
                                                    <ul className={styles.planFeature}>
                                                        <li>400 Words per cycle</li>
                                                        <li>50 Monthly Requests</li>
                                                        <li>Rephrases AI-generated content to bypass ALL AI-Detectors.</li>
                                                        <li>Available 24/7</li>
                                                        <li>Retain the original value and meaning of the text</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className={styles.planCard}>
                                                <div>
                                                    <span className={styles.planTag}>Standard</span>
                                                    <div className={styles.planPrice}>$39 <span>/ month Billed Annually</span></div>
                                                    <p className={styles.planPara}>
                                                        Great for users like students, teachers, and business professionals who intend for humans to read their AI-generated outputs.
                                                    </p>
                                                    <div className={styles.planType} onClick={(e) => { e.preventDefault(); handleSubmit(AllPlans.subscribed_standard); }}>
                                                        Choose Standard Plan
                                                    </div>
                                                    <ul className={styles.planFeature}>
                                                        <li>400 Words per cycle</li>
                                                        <li>100 Monthly Requests</li>
                                                        <li>Rephrases AI-generated content to bypass ALL AI-Detectors.</li>
                                                        <li>Available 24/7</li>
                                                        <li>Retain the original value and meaning of the text</li>
                                                        <li>Bypass AI detection + make any text sound like you wrote it!</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className={styles.planCard}>
                                                <div>
                                                    <span className={styles.planTag}>Premium</span>
                                                    <div className={styles.planPrice}>$89 <span>/ month Billed Annually</span></div>
                                                    <p className={styles.planPara}>
                                                        Bring your own API key, ideal for SEOs and marketing shops
                                                    </p>
                                                    <div className={styles.planType} onClick={(e) => { e.preventDefault(); handleSubmit(AllPlans.subscribed_premium); }}>
                                                        Choose Premium Plan
                                                    </div>
                                                    <ul className={styles.planFeature}>
                                                        <li>Unlimited words per cycle</li>
                                                        <li>Unlimited Monthly Requests</li>
                                                        <li>Rephrases AI-generated content to bypass ALL AI-Detectors.</li>
                                                        <li>Available 24/7</li>
                                                        <li>Retain the original value and meaning of the text</li>
                                                        <li>Bypass AI detection + make any text sound like you wrote it!</li>
                                                    </ul>
                                                </div>
                                                <span className={styles.planCardPopular}>Most Popular</span>
                                            </div>
                                        </div>
                                        {/* )} */}
                                    </div>
                                ) : (
                                    // Monthly Plan Content
                                    <div className={styles.monthlyPlanContent}>

                                        {/* {selectedPlan == "yearly" && ( */}
                                        <div className={styles.planCardParent}>

                                            <div className={styles.planCard}>
                                                <div>
                                                    <span className={styles.planTag}>Basic</span>
                                                    <div className={styles.planPrice}>$19 <span>/ month</span></div>
                                                    <p className={styles.planPara}>
                                                        Best for occasional users of ChatGPT or other AI writing tools.
                                                    </p>
                                                    <div className={styles.planType} onClick={(e) => { e.preventDefault(); handleSubmit(AllPlans.month_basic); }}>
                                                        Choose Basic Plan
                                                    </div>
                                                    <ul className={styles.planFeature}>
                                                        <li>400 Words per cycle</li>
                                                        <li>50 Monthly Requests</li>
                                                        <li>Rephrases AI-generated content to bypass ALL AI-Detectors.</li>
                                                        <li>Available 24/7</li>
                                                        <li>Retain the original value and meaning of the text</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className={styles.planCard}>
                                                <div>
                                                    <span className={styles.planTag}>Standard</span>
                                                    <div className={styles.planPrice}>$49 <span>/ month</span></div>
                                                    <p className={styles.planPara}>
                                                        Great for users like students, teachers, and business professionals who intend for humans to read their AI-generated outputs.
                                                    </p>
                                                    {/* <h5 className={styles.planType}></h5> */}
                                                    <div className={styles.planType} onClick={(e) => { e.preventDefault(); handleSubmit(AllPlans.month_standard); }}>
                                                        Choose Standard Plan
                                                    </div>
                                                    <ul className={styles.planFeature}>
                                                        <li>400 Words per cycle</li>
                                                        <li>100 Monthly Requests</li>
                                                        <li>Rephrases AI-generated content to bypass ALL AI-Detectors.</li>
                                                        <li>Available 24/7</li>
                                                        <li>Retain the original value and meaning of the text</li>
                                                        <li>Bypass AI detection + make any text sound like you wrote it!</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className={styles.planCard}>
                                                <div>
                                                    <span className={styles.planTag}>Enterprise</span>
                                                    <div className={styles.planPrice}>$99 <span>/ month</span></div>
                                                    <p className={styles.planPara}>
                                                        Bring your own API key, ideal for SEOs and marketing shops
                                                    </p>
                                                    <div className={styles.planType} onClick={(e) => { e.preventDefault(); handleSubmit(AllPlans.month_enterprise); }}>
                                                        Choose Enterprise Plan
                                                    </div>
                                                    <ul className={styles.planFeature}>
                                                        <li>Unlimited</li>
                                                        <li>Unlimited</li>
                                                        <li>Rephrases AI-generated content to bypass ALL AI-Detectors.</li>
                                                        <li>Available 24/7</li>
                                                        <li>Retain the original value and meaning of the text</li>
                                                        <li>Bypass AI detection + make any text sound like you wrote it!</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        {/* )} */}



                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default PricingPr;