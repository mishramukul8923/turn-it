"use client";
import React, { useState, useEffect, useRef } from 'react'
import styles from './dashboard.module.css';
import { Image } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import FetchUserById from '@/utils/FetchUserById';


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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DecodeTokenEmail from '@/utils/DecodeTokenEmail';
import FetchUserDetails from '@/utils/FetchUserDetails';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";




const DashAccount = () => {
  const my_plan = localStorage.getItem("plan_id");
  const [showAllSubscriptions, setShowAllSubscriptions] = useState(false);
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);
  const [image, setImage] = useState(null);
  const [token, setToken] = useState(null);
  const [success, setSuccess] = useState(false)
  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [apikey, setapikey] = useState('')
  const [mySubscriptions, setMySubscriptions] = useState([])
  const [userId, setUserId] = useState(null)
  const { toast } = useToast();


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');
    setToken(storedToken);
    setUserId(userId)
  }, []);

  useEffect(() => {
    console.log("this is success value", success)
    if (success) {
      window.location.reload();
    }
  }, [success])

  // ==================social login=============================
  const { data: session, status } = useSession();
  const [updateData, setUpdateData] = useState(false);

  // Log the entire session object
  // Log specific session properties
  useEffect(() => {
    const handleSessionOrToken = async () => {
      // Handle token logic
      const token = localStorage.getItem("token");
      const emailNew = localStorage.getItem('email')

      if (token) {
        try {

          //   const email = DecodeTokenEmail(token); // Replace with your decoding logic
          const allUser = await FetchUserById(userId); // Replace with your API call
          const fetchedUserDetails = allUser.filter((data) => data.email == emailNew);
          fetchTransactionHistory(fetchedUserDetails[0].subscription)
          const email = fetchedUserDetails[0].email;
          setUserDetails(fetchedUserDetails[0]); // Store the fetched details in state

        } catch (error) {
          console.error("Failed to handle token logic:", error);
        }
      } else {
        console.warn("No session or token found.");
      }

    };

    handleSessionOrToken();
  }, [session, updateData]);


  // name initals in image
  const getInitials = useMemo(() => {
    if (userDetails?.name || userDetails?.firstname || userDetails?.lastname) {

      let firstNameInitial = '';
      let lastNameInitial = '';

      if (userDetails.name) {
        const nameParts = userDetails.name.split(" ");
        firstNameInitial = nameParts[0]?.charAt(0).toUpperCase() || '';
        lastNameInitial = nameParts[1]?.charAt(0).toUpperCase() || ''; // Handles case with two parts (first and last)
      } else if (userDetails.firstname && userDetails.lastname) {
        firstNameInitial = userDetails.firstname[0]?.toUpperCase() || '';
        lastNameInitial = userDetails.lastname[0]?.toUpperCase() || '';
      } else if (userDetails.firstname) {
        firstNameInitial = userDetails.firstname[0]?.toUpperCase() || '';
      } else if (userDetails.lastname) {
        firstNameInitial = userDetails.lastname[0]?.toUpperCase() || '';
      }

      return (firstNameInitial + lastNameInitial);

    }

    return '';
  }, [userDetails]);










  const handleUpload = async (file) => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select an image to upload.',
        variant: 'error',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (token) {
      const email = DecodeTokenEmail(token);
      formData.append('email', email);
    }

    try {
      const response = await fetch('/api/userDp', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
      console.log('Image uploaded successfully:', result);
      setSuccess(true);
      toast({
        title: 'Success',
        description: 'Image uploaded successfully!',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Error uploading image. Please try again.',
        variant: 'error',
      });
    }
  };

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle the file (e.g., upload it or display a preview)
      setImage(file); // Set the selected file to state
      handleUpload(file); // Automatically trigger upload

    }
  };


  const handleEditProfile = async (e) => {
    e.preventDefault()
    try {
      const userId = localStorage.getItem('userId');

      const response = await fetch('/api/users/editprofile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          firstname: userDetails?.firstname,
          lastname: userDetails?.lastname,
          email: userDetails?.email
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText);
        throw new Error('Failed to update profile');
      }

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("name", userDetails?.firstname + " " + userDetails?.lastname)
        localStorage.setItem("email", userDetails?.email)
        setSuccess(true);
        toast({
          title: 'Success',
          description: 'Profile updated successfully!',
          variant: 'success',
        });
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'error',
      });
    }
  };






  const handleRemoveProfilePicture = async () => {
    if (!token) {
      toast({
        title: 'Error',
        description: 'User is not authenticated.',
        variant: 'error',
      });
      return;
    }

    const email = DecodeTokenEmail(token);
    try {
      const response = await fetch('/api/removeDp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove image');
      }

      const result = await response.json();
      console.log('Image removed successfully:', result);
      setImage(null); // Clear the local state if needed
      setSuccess(true);
      toast({
        title: 'Success',
        description: 'Profile picture removed successfully!',
        variant: 'success',
      });

    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: 'Error',
        description: 'Error removing image. Please try again.',
        variant: 'error',
      });
    }
  };

  const handleUploadClick = () => {
    // Trigger the file input click
    fileInputRef.current.click();
  };

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

  const [loading, setLoading] = useState(false);

  const handleRemoveSubs = async (email, subs) => {
    const body = {
      subscription: [subs],
      email: email
    }
    try {
      const response = await fetch('/api/remove-subscription', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Error canceling subscription');
      }
      else {
        const data = await response.json();
        setUpdateData(!updateData)
      }
      // Optionally show a success message to the user
    } catch (err) {
      console.log("Error in update:", err.message);
    }
  }


  const handleCancelSubscription = async (subscriptionId) => {
    const email = userDetails.email;

    if (!subscriptionId) {
      console.log("Unable to fetch user details");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId, email }),
      });

      if (!response.ok) {
        toast({
          title: 'Error',
          description: 'Something Went Wrong, Please Try Again.',
          variant: 'error',
        });
        throw new Error('Error canceling subscription');
      }
      else {
        const data = await response.json();
        toast({
          title: 'Success',
          description: 'Subscription canceled successfully!',
          variant: 'success',
        });
        setUpdateData(!updateData)
        // handleRemoveSubs(email, subscriptionId);
      }
      // Optionally show a success message to the user
    } catch (err) {
      console.log("Error in update:", err.message);
    }
  };


  const handleChangeCard = async () => {
    console.log("change card clicked ")
  }

  const formatData = (inputDate) => {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, "0"); // Ensure day is two digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const fetchTransactionHistory = async (allSubs) => {
    const userID = localStorage.getItem("userId");

    // Check if userID is valid
    if (!userID) {
      console.error("User ID is not found in local storage");
      return; // Exit the function if userID is not available
    }

    try {
      const response = await fetch(`/api/save-subscription?user_id=${userID}`);

      if (!response.ok) {
        const errorMessage = await response.text(); // Get the error message from the response
        throw new Error(`Network response was not ok: ${errorMessage}`);
      }
      else {
        const data = await response.json(); // Parse the JSON response
        const mySubs = allSubs || [];
        const filteredData = Array.isArray(mySubs)
          ? data.data.filter(item => mySubs.includes(item.subscription))
          : [];
        setMySubscriptions(filteredData); // Set the fetched data to state
      }
    } catch (error) {
      console.log("Error fetching transaction history:", error);
    }
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
        <div className={`${styles.turnitApiDetectorheading} ${styles.turnitApiDetectorheadingpade}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
            <g clipPath="url(#clip0_995_1225)">
              <path d="M9.37161 8.7149C10.5628 8.7149 11.5941 8.28767 12.4371 7.44475C13.2797 6.60196 13.7071 5.57076 13.7071 4.37943C13.7071 3.18851 13.2799 2.15717 12.4369 1.3141C11.594 0.471451 10.5627 0.04422 9.37161 0.04422C8.18028 0.04422 7.14908 0.471451 6.30629 1.31424C5.4635 2.15703 5.03613 3.18837 5.03613 4.37943C5.03613 5.57076 5.4635 6.6021 6.30629 7.44489C7.14935 8.28754 8.18069 8.7149 9.37161 8.7149ZM7.05226 2.06007C7.69894 1.41339 8.45755 1.09904 9.37161 1.09904C10.2855 1.09904 11.0443 1.41339 11.6911 2.06007C12.3378 2.70689 12.6523 3.46564 12.6523 4.37943C12.6523 5.29349 12.3378 6.05209 11.6911 6.69891C11.0443 7.34573 10.2855 7.66008 9.37161 7.66008C8.45782 7.66008 7.69922 7.3456 7.05226 6.69891C6.40544 6.05223 6.09096 5.29349 6.09096 4.37943C6.09096 3.46564 6.40544 2.70689 7.05226 2.06007Z" fill="white" />
              <path d="M16.9577 13.8854C16.9333 13.5346 16.8842 13.152 16.8118 12.748C16.7388 12.341 16.6447 11.9562 16.5321 11.6045C16.4156 11.241 16.2576 10.882 16.0619 10.538C15.859 10.1809 15.6206 9.87 15.3531 9.61415C15.0734 9.3465 14.7309 9.1313 14.3348 8.97433C13.9401 8.81819 13.5027 8.73909 13.0349 8.73909C12.8511 8.73909 12.6734 8.81448 12.3302 9.03792C12.119 9.17566 11.8719 9.33496 11.5962 9.51115C11.3604 9.66139 11.041 9.80215 10.6464 9.9296C10.2615 10.0542 9.87065 10.1173 9.48476 10.1173C9.09914 10.1173 8.7083 10.0542 8.32309 9.9296C7.92896 9.80229 7.60939 9.66153 7.37401 9.51129C7.10086 9.33675 6.85367 9.17744 6.6393 9.03778C6.29639 8.81435 6.11868 8.73895 5.93494 8.73895C5.46692 8.73895 5.02966 8.81819 4.63512 8.97447C4.23933 9.13116 3.8967 9.34636 3.61668 9.61429C3.34917 9.87027 3.11076 10.181 2.90807 10.538C2.71265 10.882 2.55444 11.2408 2.43799 11.6046C2.32552 11.9563 2.23145 12.341 2.15839 12.748C2.08588 13.1515 2.03685 13.5342 2.01254 13.8858C1.98865 14.2295 1.97656 14.5872 1.97656 14.9487C1.97656 15.8883 2.27525 16.649 2.86426 17.21C3.44598 17.7635 4.21558 18.0442 5.15175 18.0442H13.8189C14.7548 18.0442 15.5244 17.7635 16.1062 17.21C16.6954 16.6494 16.994 15.8884 16.994 14.9486C16.9939 14.5859 16.9817 14.2281 16.9577 13.8854ZM15.3789 16.4457C14.9945 16.8116 14.4842 16.9894 13.8187 16.9894H5.15175C4.48611 16.9894 3.9758 16.8116 3.59155 16.4459C3.21458 16.087 3.03139 15.5972 3.03139 14.9487C3.03139 14.6114 3.04251 14.2784 3.06476 13.9587C3.08646 13.645 3.13081 13.3005 3.19659 12.9344C3.26155 12.5728 3.34422 12.2334 3.44255 11.9262C3.5369 11.6317 3.66557 11.34 3.82515 11.059C3.97745 10.7912 4.15268 10.5614 4.34604 10.3763C4.5269 10.2032 4.75487 10.0614 5.02348 9.95514C5.27191 9.85681 5.5511 9.80298 5.85419 9.79488C5.89113 9.81451 5.95691 9.85201 6.06348 9.92149C6.28032 10.0628 6.53026 10.224 6.80656 10.4005C7.11803 10.5991 7.5193 10.7784 7.99872 10.9332C8.48885 11.0917 8.98872 11.1721 9.48489 11.1721C9.98106 11.1721 10.4811 11.0917 10.9709 10.9333C11.4508 10.7783 11.8519 10.5991 12.1638 10.4002C12.4465 10.2195 12.6895 10.0629 12.9063 9.92149C13.0129 9.85214 13.0787 9.81451 13.1156 9.79488C13.4188 9.80298 13.698 9.85681 13.9466 9.95514C14.2151 10.0614 14.443 10.2033 14.6239 10.3763C14.8172 10.5613 14.9925 10.7911 15.1448 11.0591C15.3045 11.34 15.4333 11.6318 15.5275 11.9261C15.626 12.2337 15.7088 12.5729 15.7736 12.9342C15.8392 13.301 15.8837 13.6457 15.9054 13.9588V13.9591C15.9278 14.2776 15.9391 14.6105 15.9392 14.9487C15.9391 15.5973 15.7559 16.087 15.3789 16.4457Z" fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_995_1225">
                <rect width="18" height="18" fill="white" transform="translate(0.5 0.0442505)" />
              </clipPath>
            </defs>
          </svg>

          <p>Account</p>
        </div>
        <div className={styles.plansBtn}>{fetchPlan()}</div>
      </div>


      <div className={styles.turnitApiDetectorBgAccount}>
        <div className={styles.turnitApiDetectorContent}>
          <div className={styles.tadcProfileImgEditProfile}>
            <div className={styles.tadcProfileImg}>
              <div className={styles.tadcProfileImgset}>
                {/* <Image className={styles.tadcProfileImgsetwidth} src="/images/changepic.png" alt="profile" fluid /> */}
                {userDetails && (
                  <div
                    className={`${styles.profileInitials}
                                          ${styles.tadcProfileImgsetwidth} 
                                      `}

                  >
                    {getInitials ? getInitials : <Image
                      className={styles.tadcProfileImgsetwidth}
                      src={userDetails?.image || "/images/changeImag.png"}  // Default image in case no image is provided
                      alt="profile"
                      width={96}
                      height={96}
                    />}  {/* Improved conditional rendering */}
                  </div>
                )}


                <Dialog>
                  <DialogTrigger asChild>
                    {/* <Button variant="outline">Edit Profile</Button> */}
                    {/* <button><Image src="/images/tapedit.svg" alt="profile" fluid /></button> */}
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Image</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile Image here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">

                      <div className="items-center flex justify-center">
                        {userDetails && (

                          <div
                            className={`${styles.profileInitials} ${styles.tadcProfileImgsetwidth} flex items-center justify-center`}
                            style={{ backgroundColor: '#8e44ad', color: 'white', width: '96px', height: '96px', borderRadius: '50%' }}
                          >
                            {getInitials || <span>No Name</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    <DialogFooter>

                      <form onSubmit={(e) => e.preventDefault()}>
                        {/* Hidden file input */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                          style={{ display: 'none' }}
                        />

                        {/* Upload button to trigger file input */}
                        <Button type="button" onClick={handleUploadClick}>
                          Upload
                        </Button>
                      </form>
                      <Button className="mb-4 mb-lg-0" type="submit" onClick={handleRemoveProfilePicture}>Remove</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div>
                <h4>Profile</h4>
                <p>Your profile information</p>
              </div>


            </div>
            <Dialog>
              <DialogTrigger asChild>
                {/* <Button variant="outline">Edit Profile</Button> */}
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><g clipPath="url(#clip0_346_13990)"><path d="M22.1511 15.0771C21.8209 15.0771 21.5533 15.3447 21.5533 15.6748V20.9819C21.5522 21.9719 20.7501 22.7742 19.7602 22.7751H2.98862C1.99864 22.7742 1.19662 21.9719 1.19545 20.9819V5.40586C1.19662 4.41611 1.99864 3.61385 2.98862 3.61268H8.29576C8.62591 3.61268 8.89348 3.34511 8.89348 3.01496C8.89348 2.68504 8.62591 2.41724 8.29576 2.41724H2.98862C1.33881 2.4191 0.00186789 3.75605 0 5.40586V20.9822C0.00186789 22.632 1.33881 23.9689 2.98862 23.9708H19.7602C21.41 23.9689 22.7469 22.632 22.7488 20.9822V15.6748C22.7488 15.3447 22.4812 15.0771 22.1511 15.0771Z" fill="#FFF"></path><path d="M22.5121 0.878905C21.4616 -0.171549 19.7586 -0.171549 18.7081 0.878905L8.04433 11.5427C7.97124 11.6158 7.91848 11.7064 7.89093 11.8058L6.48861 16.8685C6.43094 17.0761 6.48954 17.2983 6.64178 17.4508C6.79424 17.603 7.01652 17.6616 7.22409 17.6042L12.2868 16.2017C12.3862 16.1741 12.4768 16.1213 12.5499 16.0483L23.2134 5.38425C24.2623 4.3331 24.2623 2.63145 23.2134 1.5803L22.5121 0.878905ZM9.34671 11.9312L18.0742 3.20349L20.8889 6.01817L12.1612 14.7459L9.34671 11.9312ZM8.78448 13.0594L11.0332 15.3083L7.92268 16.1701L8.78448 13.0594ZM22.3682 4.53903L21.7343 5.17295L18.9194 2.35804L19.5536 1.72412C20.137 1.14064 21.0831 1.14064 21.6666 1.72412L22.3682 2.42552C22.9508 3.0097 22.9508 3.95508 22.3682 4.53903Z" fill="#FFF"></path></g><defs><clipPath id="clip0_346_13990"><rect width="24" height="24" fill="white"></rect></clipPath></defs></svg>
                </button>
              </DialogTrigger>

              {/* ============edit profile ========= */}
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleEditProfile}>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="firstname" className="text-right">
                        First Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter Name"
                        value={userDetails?.firstname}
                        onChange={(e) => setUserDetails({
                          ...userDetails,
                          firstname: e.target.value
                        })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="lastname" className="text-right">
                        Last Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter Name"
                        value={userDetails?.lastname}
                        onChange={(e) => setUserDetails({
                          ...userDetails,
                          lastname: e.target.value
                        })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Email
                      </Label>
                      <Input
                        type="email"
                        id="username"
                        placeholder="Enter Email"
                        value={userDetails?.email}
                        onChange={(e) => setUserDetails({
                          ...userDetails,
                          email: e.target.value
                        })}
                        // defaultValue="@peduarte"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>

              {/* =========edit form end======= */}
            </Dialog>
          </div>



        </div>
        <div className={styles.turnitApiDetectorKey}>
          {/* 1 */}
          <div className={styles.tApiDetectorKey}>
            <h5>Name</h5>
            <div className={styles.tApiDetectorKeyeditbtn}>
              {/* <p>Name</p> */}
              <p>{userDetails ? `${userDetails.firstname}  ${userDetails.lastname || ''}` : 'Name not available'}</p>

            </div>
          </div>
          {/* 2 */}
          <div className={styles.tApiDetectorKey}>
            <h5>Email</h5>
            <div className={styles.tApiDetectorKeyeditbtn}>
              {/* <p>example@gmail.com</p> */}
              <p>{userDetails ? ` ${userDetails.email}` : 'email not available'}</p>
              {/* <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><g clipPath="url(#clip0_346_13990)"><path d="M22.1511 15.0771C21.8209 15.0771 21.5533 15.3447 21.5533 15.6748V20.9819C21.5522 21.9719 20.7501 22.7742 19.7602 22.7751H2.98862C1.99864 22.7742 1.19662 21.9719 1.19545 20.9819V5.40586C1.19662 4.41611 1.99864 3.61385 2.98862 3.61268H8.29576C8.62591 3.61268 8.89348 3.34511 8.89348 3.01496C8.89348 2.68504 8.62591 2.41724 8.29576 2.41724H2.98862C1.33881 2.4191 0.00186789 3.75605 0 5.40586V20.9822C0.00186789 22.632 1.33881 23.9689 2.98862 23.9708H19.7602C21.41 23.9689 22.7469 22.632 22.7488 20.9822V15.6748C22.7488 15.3447 22.4812 15.0771 22.1511 15.0771Z" fill="#FFF"></path><path d="M22.5121 0.878905C21.4616 -0.171549 19.7586 -0.171549 18.7081 0.878905L8.04433 11.5427C7.97124 11.6158 7.91848 11.7064 7.89093 11.8058L6.48861 16.8685C6.43094 17.0761 6.48954 17.2983 6.64178 17.4508C6.79424 17.603 7.01652 17.6616 7.22409 17.6042L12.2868 16.2017C12.3862 16.1741 12.4768 16.1213 12.5499 16.0483L23.2134 5.38425C24.2623 4.3331 24.2623 2.63145 23.2134 1.5803L22.5121 0.878905ZM9.34671 11.9312L18.0742 3.20349L20.8889 6.01817L12.1612 14.7459L9.34671 11.9312ZM8.78448 13.0594L11.0332 15.3083L7.92268 16.1701L8.78448 13.0594ZM22.3682 4.53903L21.7343 5.17295L18.9194 2.35804L19.5536 1.72412C20.137 1.14064 21.0831 1.14064 21.6666 1.72412L22.3682 2.42552C22.9508 3.0097 22.9508 3.95508 22.3682 4.53903Z" fill="#FFF"></path></g><defs><clipPath id="clip0_346_13990"><rect width="24" height="24" fill="white"></rect></clipPath></defs></svg>
                            </button> */}
            </div>
          </div>
          {/* {my_plan != "0" && <><div className={`${styles.tApiDetectorKey} ${styles.cancelBtnParent}`}>
                        <div className={`${styles.plansBtn} ${styles.cancelSubscription}`} onClick={() => { setShowAllSubscriptions(true); }}>
                            Cancel Subscription
                        </div>
                    </div>
                        <div className={`${styles.tApiDetectorKey} ${styles.cancelBtnParent}`}>
                            <div className={`${styles.plansBtn} ${styles.cancelSubscription}`} onClick={() => { handleChangeCard() }}>
                                Change Card
                            </div>
                        </div></>} */}
          <div className={styles.tApiDetectorKey}>
            <Link href="/change-password">
              <h4><svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none"><path d="M20.1903 10.8225C19.6029 10.2352 18.822 9.91195 17.9915 9.91195H17.7665V6.8212C17.7665 3.66408 15.1982 1.0957 12.0412 1.0957H11.8295C8.67259 1.0957 6.10403 3.66408 6.10403 6.8212V9.91177H5.87903C5.04859 9.91177 4.26766 10.2352 3.68022 10.8225C3.09297 11.4099 2.76953 12.1908 2.76953 13.0215V20.7937C2.76953 21.6243 3.09297 22.4053 3.68022 22.9923C4.26747 23.5798 5.04841 23.9032 5.87903 23.9032H17.9915C18.8222 23.9032 19.6031 23.5798 20.1905 22.9923C20.7778 22.4051 21.1012 21.6241 21.1012 20.7937V13.0215C21.1012 12.191 20.7778 11.4101 20.1903 10.8225ZM7.60403 6.8212C7.60403 4.49133 9.49947 2.5957 11.8295 2.5957H12.0412C14.3711 2.5957 16.2665 4.49133 16.2665 6.8212V9.91177H7.60403V6.8212ZM19.6012 20.7937C19.6012 21.2173 19.4293 21.632 19.1298 21.9316C18.8257 22.2358 18.4215 22.4032 17.9915 22.4032H5.87903C5.44909 22.4032 5.04503 22.2358 4.74072 21.9315C4.43678 21.6277 4.26934 21.2236 4.26934 20.7937V13.0215C4.26934 12.5915 4.43678 12.1871 4.74072 11.8831C5.04484 11.5792 5.44891 11.4118 5.87884 11.4118H17.9913C18.4213 11.4118 18.8255 11.5792 19.1295 11.883C19.4336 12.1873 19.601 12.5915 19.601 13.0215L19.6012 20.7937Z" fill="#fff"></path><path d="M11.9355 14.8364C11.5214 14.8364 11.1855 15.1722 11.1855 15.5864V18.2287C11.1855 18.6429 11.5214 18.9787 11.9355 18.9787C12.3497 18.9787 12.6855 18.6429 12.6855 18.2287V15.5864C12.6855 15.1722 12.3497 14.8364 11.9355 14.8364Z" fill="#fff"></path></svg>
                Change Password</h4>
            </Link>

          </div>
        </div>

        {my_plan != "0" && <div className={styles.tapicancelsubscription}>
          <Dialog>
            <DialogTrigger asChild>
              <button>
                Cancel Subscription
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[850px]">
              <DialogHeader>
                <DialogTitle>    Cancel Subscription</DialogTitle>
                <DialogDescription>
                  Make changes to your Cancel Subscription here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <Table className="my-subscriptions">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[70px]">S no.</TableHead>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead >Amount</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    mySubscriptions && mySubscriptions.length > 0 && mySubscriptions.map((data, idx) =>
                      <TableRow key={idx}>
                        <TableCell className="w-[50px]">{idx + 1}</TableCell>
                        <TableCell className="font-medium">{data.paymentId}</TableCell>
                        <TableCell>{formatData(data.started_at)}</TableCell>
                        <TableCell>{formatData(data.plan_expired)}</TableCell>
                        <TableCell>${data.price}</TableCell>
                        <TableCell className="text-right"><div className={styles.actionBtn} onClick={() => { handleCancelSubscription(data.subscription) }}>Cancel Subscription</div>
                        </TableCell>
                      </TableRow>)
                  }
                </TableBody>
              </Table>
            </DialogContent>


          </Dialog>
        </div>}
      </div>
    </div>

  )
}

export default DashAccount