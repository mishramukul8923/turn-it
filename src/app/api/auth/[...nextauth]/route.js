// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";





export const authOptions = {

  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        // params: {
        //   redirect_uri: 'https://newtrurnit.vercel.app/api/auth/callback/google', // Your correct redirect URI here
        // },
      },
    }),
    
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/signin', // Custom sign-in page
  },
  // secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      // console.log("this session and token in authOption", session);
      // console.log("this is token", token);

        if (!token) {
            console.error("Token is missing in session callback.");
            return session; // Optionally return an incomplete session
        }
        // console.log("Token details:", token);
        session.user.id = token.sub || null; // Safely access token.sub
        session.user.accessToken = token.accessToken; // Access the token you added in jwt
        return session;
    },
    async jwt({ token, user, account }) {
      // console.log("JWT callback triggered");
      // console.log("Token in jwt :", token);
      if (user) {
          // console.log("User in jwt :", user);
          token.id = user.id;
      }
      if (account) {
          // console.log("Account in jwt :", account);
          token.accessToken = account.access_token;
      }
      return token;
  }
  
},

};


const handler = await  NextAuth(authOptions);

export { handler as GET, handler as POST };





