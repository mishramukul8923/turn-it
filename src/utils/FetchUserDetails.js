const FetchUserDetails = async (email) => {
    try {
        const url = email ? `/api/users?email=${encodeURIComponent(email)}` : '/api/users';
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
       return data;
    } catch (error) {
        console.error("Failed to fetch user details:", error);
    }
};

export default FetchUserDetails;
