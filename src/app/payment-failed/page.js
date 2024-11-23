"use client"
import React, { useEffect, useState } from 'react'
import styles from '../payment-success/page.module.css'
import { useRouter } from 'next/navigation';
import { Image } from 'react-bootstrap';

const page = () => {

    const [timer, setTimer] = useState(500000);
    const router = useRouter();

    useEffect(() => {
        const clockTime = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 1) {
                    clearInterval(clockTime);
                    router.push('/dashboard/pricing-plan');
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(clockTime); // Cleanup on unmount
    }, []);

    return (
        <div className={styles.paymentPageMsg}>



            <div className={styles.payemntDiv}>
                <div className={styles.turnitLogo}>
                    <Image src='/images/turnit-logo.svg' />
                </div>
                <svg width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="65.5556" height="65.5556" rx="32.7778" fill="#FFE4E4" />
                    <path d="M19.0668 46.8034C19.0426 46.8034 19.0203 46.8034 18.9943 46.8015C18.4081 46.7718 17.8332 46.6452 17.2861 46.4238C14.5936 45.3297 13.2948 42.2539 14.387 39.5632L28.0096 15.6972C28.4785 14.8487 29.1893 14.1379 30.0564 13.6578C32.5964 12.2511 35.808 13.1759 37.2129 15.7139L50.7462 39.3976C51.0476 40.1066 51.176 40.6834 51.2076 41.2714C51.2802 42.6781 50.8001 44.0272 49.8586 45.071C48.917 46.1149 47.6238 46.7308 46.219 46.8015L19.2008 46.8034H19.0668Z" stroke="#FF7070" stroke-width="3" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M30.9785 26.0625C30.9785 25.1657 31.7098 24.4344 32.6067 24.4344C33.5036 24.4344 34.2348 25.1657 34.2348 26.0625V31.3248C34.2348 32.2235 33.5036 32.9529 32.6067 32.9529C31.7098 32.9529 30.9785 32.2235 30.9785 31.3248V26.0625ZM30.9787 37.6906C30.9787 36.7881 31.71 36.0531 32.6069 36.0531C33.5038 36.0531 34.2351 36.7788 34.2351 37.6701C34.2351 38.5875 33.5038 39.3188 32.6069 39.3188C31.71 39.3188 30.9787 38.5875 30.9787 37.6906Z" fill="#FF7070" />
                </svg>
                <h1 className={styles.payemntFailed}>
                    Payment Failed
                </h1>
                <p>Redirecting to Price Page with in {timer} seconds...</p>

            </div>

        </div>
    )
}

export default page
