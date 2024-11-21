import React from 'react'




    const DecodeTokenEmail = (token) => {
        // Split the token into its parts
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT token is invalid');
        }
        
        // Decode the payload (the second part)
        const payload = parts[1];
        const decodedPayload = JSON.parse(atob(payload));
        
        // Return the email
        return decodedPayload.email; // Adjust this based on your token structure
    };
  

export default DecodeTokenEmail