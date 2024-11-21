'use client';
import React, { useState, useEffect } from 'react';
import styles from './dashboard.module.css';
import { Image } from 'react-bootstrap';
// import { useToast } from "@/components/hooks/use-toast";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';



const ApiKey = () => {
    const [GPTzero, setGPTzero] = useState('');
    const [ZeroGPT, setZeroGPT] = useState('');
    const [Originality, setOriginality] = useState('');
    const [CopyLeaks, setCopyLeaks] = useState('');
    const { toast } = useToast(); // Using ShadCN toast
    const [userId, setUserId] = useState('');
  const router = useRouter();

    

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
        const fetchApiKeys = async () => {
            try {
                const response = await fetch(`/api/apiKeys/672daf0549f3b3dcda8d069b`, { method: 'GET' });
                // console.log("this is data i get in api response", await response.json())
                // const data = await response.json();
                // console.log("final data", data)
                if (response.ok) {
                    const data = await response.json();
                    setGPTzero(data.data.gptZeroApiKey || '');
                    setZeroGPT(data.data.zeroGptApiKey || '');
                    setOriginality(data.data.originalityApiKey || '');
                    setCopyLeaks(data.data.copyLeaksApiKey || '');
                    // toast({
                    //     title: "Success",
                    //     description: "API keys loaded successfully.",
                    // });
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to load API keys.",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error('Error fetching API keys:', error);
                toast({
                    title: "Error",
                    description: "Unable to fetch API keys.",
                    variant: "destructive",
                });
            }
        };

        fetchApiKeys();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            userId:userId,
            gptZeroApiKey: GPTzero || null,
            zeroGptApiKey: ZeroGPT || null,
            originalityApiKey: Originality || null,
            copyLeaksApiKey: CopyLeaks || null,
        };

        const filledData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value)
        );

        if (Object.keys(filledData).length === 0) {
            toast({
                title: "Validation Error",
                description: "Please fill at least one API key field.",
                variant: "destructive",
            });
            return;
        }

        try {
            const response = await fetch('/api/apiKeys', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filledData),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "API keys updated successfully.",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to update API keys.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error updating API keys:", error);
            toast({
                title: "Error",
                description: "Error: Unable to save API keys.",
                variant: "destructive",
            });
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className={styles.turnitApiDetectorheadingbg}>
            <div className={styles.turnitApiDetectorheading}>
            <div>
                    <button className={styles.turnitGenPastepadiback} onClick={handleBack}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                            <path d="M8.03033 5.20794C8.32322 4.91505 8.32322 4.44018 8.03033 4.14728C7.73744 3.85439 7.26256 3.85439 6.96967 4.14728L2.625 8.49195C2.03921 9.07774 2.03921 10.0275 2.625 10.6133L6.96967 14.9579C7.26256 15.2508 7.73744 15.2508 8.03033 14.9579C8.32322 14.665 8.32322 14.1902 8.03033 13.8973L4.43566 10.3026H15C15.4142 10.3026 15.75 9.96683 15.75 9.55261C15.75 9.1384 15.4142 8.80261 15 8.80261H4.43566L8.03033 5.20794Z" fill="#FCFCFC" />
                        </svg>
                        Back
                    </button>
                </div>
                <div className={styles.turnitGenPastepadiapikey}>
                <Image src="/images/apkey.svg" alt="API Keys" fluid />
                <p>API Keys</p>
                </div>
            </div>
            <div className={styles.turnitApiDetectorBg}>
                <div className={styles.turnitApiDetectorContent}>
                    <h4>AI Detector API Keys</h4>
                    <p>Enter your API keys for various AI detectors</p>
                    <p>We do not store API keys; they are saved in your browser’s local storage</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.turnitApiDetectorKey}>
                        <div className={styles.tApiDetectorKey}>
                            <h5>GPTzero API key</h5>
                            <input
                                type="text"
                                placeholder="Enter GPTzero API key"
                                value={GPTzero}
                                onChange={(e) => setGPTzero(e.target.value)}
                            />
                        </div>
                        <div className={styles.tApiDetectorKey}>
                            <h5>ZeroGPT API key</h5>
                            <input
                                type="text"
                                placeholder="Enter ZeroGPT API key"
                                value={ZeroGPT}
                                onChange={(e) => setZeroGPT(e.target.value)}
                            />
                        </div>
                        <div className={styles.tApiDetectorKey}>
                            <h5>Originality AI API key</h5>
                            <input
                                type="text"
                                placeholder="Enter Originality AI API key"
                                value={Originality}
                                onChange={(e) => setOriginality(e.target.value)}
                            />
                        </div>
                        <div className={styles.tApiDetectorKey}>
                            <h5>CopyLeaks API key</h5>
                            <input
                                type="text"
                                placeholder="Enter CopyLeaks API key"
                                value={CopyLeaks}
                                onChange={(e) => setCopyLeaks(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.turnitApiDetectorBgbtn}>
                        <button type="submit">Save API Keys</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApiKey;
