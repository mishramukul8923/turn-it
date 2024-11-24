

import nodemailer from 'nodemailer';

// Reusable transporter for sending emails via Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
    
    
  },
});

// Send verification email function
export const sendVerificationEmail = async (email, token) => {
 
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    html: `<p>Click the link below to verify your email:</p>
           <a href="${process.env.BASE_URL}/verify?token=${token}">Verify Email</a>`,
  };

  await transporter.sendMail(mailOptions);
};

// Send reset password email function
export const sendResetPasswordEmail = async (email, token) => {
  const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset. Click the link below to reset your password:</p>
           <a href="${resetLink}">Reset Password</a>
           <p>If you didn't request this, you can ignore this email.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
