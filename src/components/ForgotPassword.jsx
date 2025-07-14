import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore'; // Removed select

const ForgotPassword = ({ countryCode }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Email validation regex
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleReset = async () => {
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      console.log('Querying with email:', email, 'and countryCode:', countryCode);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email), limit(1)); // Removed select
      console.log('Query constructed:', q);
      const querySnapshot = await getDocs(q); // Line 64
      console.log('Query result:', querySnapshot.empty, querySnapshot.docs);

      if (querySnapshot.empty) {
        setError('No account found with this email.');
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const userCountryCode = userData.countryCode?.toLowerCase();

      if (userCountryCode !== countryCode?.toLowerCase()) {
        setError(`This email is registered for ${userCountryCode === 'ng' ? 'Nigeria' : 'Ghana'} and cannot reset password for ${countryCode === 'gh' ? 'Ghana' : 'Nigeria'}.`);
        return;
      }

      const actionCodeSettings = {
        url: `http://localhost:3000/${countryCode?.toLowerCase() || 'gh'}/reset-password`,
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setMessage('A password reset link has been sent to your email. Please check your inbox and follow the link.');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError(`Failed to send reset email: ${err.message}`);
      }
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md border border-[#f47b20]">
        <h2 className="text-2xl font-bold mb-4 text-[#0b0b5c] text-center">Reset Your Password</h2>
        
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-[#0b0b5c]"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
        />
        
        <button
          onClick={handleReset}
          className="w-full bg-[#f47b20] text-white p-3 rounded hover:bg-[#e56710] transition disabled:bg-gray-400"
          disabled={!email || !isValidEmail(email)}
        >
          Send Reset Link
        </button>

        {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

        <div className="mt-6 text-center">
          <span
            onClick={() => navigate(`/${countryCode?.toLowerCase() || 'ng'}/login`)}
            className="text-[#0b0b5c] underline cursor-pointer hover:text-[#f47b20]"
          >
            Back to Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;