'use client';


import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Image } from 'react-bootstrap';

function Verify() {
  const [message, setMessage] = useState('Verifying...');
  const [verified, setVerified]= useState('')
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract the token from the URL query parameters
  const token = searchParams ? searchParams.get('token') : null;
  console.log("extract token from url", token)

  useEffect(() => {
    const verifyEmail = async () => {
      if (token) {
        try {
          // Call the API to verify the email
          const response = await fetch(`/api/authentication/verify?token=${token}`);
          console.log(" verify respose is", response)

          // Check the response status
          if (response.ok) {
            const data = await response.json();
            console.log("response in verifyEmail", data);
            setVerified('Email verified! Redirecting to login...')

            setMessage('Email verified! Redirecting to login...');

            // Redirect to the login page after a delay
            setTimeout(() => {
              router.push('/login');  // Redirect to login
            }, 2000); // 2 seconds delay before redirecting
          } else {
            const data = await response.json();
            setMessage(data.message || 'Verification failed.');
          }
        } catch (error) {
          console.error('Error verifying email:', error);
          setMessage('An error occurred during verification.');
        }
      }
    };

    // Call the verification function only when the token is available
    if (token) {
      verifyEmail();
    } else {
      setMessage('Invalid token or token missing.');
    }
  }, [token, router]);

  return (
    <>
    {/* <div className="container"> */}
        <div className="turnitLoginbgverif">
            {/* Left Side - Image and Text */}
            <div className="left-side">
            <div className="imageContainerLogo">
                    <Image
                        src="/images/turnit-logo.svg" // Use absolute path
                        alt="Login img"
                        fluid // Makes the image responsive
                    />
                </div>
                {/* <h1>
                    Unlock the Power of{' '}
                    <span className="highlight">TurnitHuman</span> Copywriting Tool
                </h1> */}
                <h1>Verified <span>Successfully</span></h1>
               
            </div>

            {/* Right Side - Login Form */}
            <div className="right-side">
                {/* <div className="logo-section">
                    <Image
                        src="/images/verfi.jpg" // Use absolute path
                        alt="Login img"
                        fluid // Makes the image responsive
                    />
                </div> */}
                <div>
             <div>{verified}</div>  
                </div>
              
               
            </div>
        </div>
    {/* </div> */}
    
</>
  );
}























export default function page() {
  return (
    <Suspense >
      <Verify />
    </Suspense>
  )
}