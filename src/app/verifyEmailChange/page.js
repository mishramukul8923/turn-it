'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Image } from 'react-bootstrap';

function Verify() {
  const [message, setMessage] = useState('Verifying...');
  const [verified, setVerified] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams?.get('token'); // Extract the token
  // console.log("extract tokon from url", token)

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setMessage('Invalid token or token missing.');
        return;
      }

      try {
        const response = await fetch(`/api/users/verifyEmailChange?token=${token}`);
        if (response.ok) {
          const data = await response.json();
          setVerified('Email verified successfully!');
          setMessage(data.message || 'Email verified! Redirecting to login...');

          setTimeout(() => {
            router.push('/login'); // Redirect after 2 seconds
          }, 2000);
        } else {
          const data = await response.json();
          setMessage(data.message || 'Verification failed.');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setMessage('An error occurred during verification.');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="turnitLoginbgverif">
      {/* Left Section */}
      <div className="left-side">
        <div className="imageContainerLogo">
          <Image
            src="/images/turnit-logo.svg"
            alt="TurnitHuman Logo"
            fluid
          />
        </div>
        <h1>
          Verified <span>Successfully</span>
        </h1>
      </div>

      {/* Right Section */}
      <div className="right-side">
        <div>{verified || message}</div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Verify />
    </Suspense>
  );
}
