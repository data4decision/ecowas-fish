import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ClientLogin() {
  const { countryCode = '' } = useParams(); // fallback to empty string
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const authInstance = getAuth();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      const user = userCredential.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError('User profile not found in Firestore.');
        await signOut(authInstance);
        return;
      }

      const userData = userSnap.data();

      const firestoreCountry = userData?.countryCode || userData?.country || '';
      const urlCountry = countryCode || '';

      console.log("✅ Firestore user country:", firestoreCountry);
      console.log("🌍 URL countryCode:", urlCountry);

      if (
        userData?.role === 'client' &&
        firestoreCountry.toLowerCase() === urlCountry.toLowerCase()
      ) {
        setMessage('Login successful!');
        navigate(`/${urlCountry.toLowerCase()}/dashboard`);
      } else {
        setError('Access denied. Your account is not authorized for this country.');
        await signOut(authInstance);
      }

    } catch (err) {
      console.error('❌ Login error:', err);
      setError(`Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-[#0b0b5c] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md border border-[#f47b20] rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {message && <p className="text-green-600 mb-3">{message}</p>}
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            required
            className="shadow border rounded w-full py-2 px-3 text-[#0b0b5c] bg-[#f4f4f4]"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            required
            className="shadow border rounded w-full py-2 px-3 text-[#0b0b5c] bg-[#f4f4f4]"
          />
        </div>

        <button
          type="submit"
          className="bg-[#0b0b5c] text-white py-2 px-4 rounded hover:bg-[#f47b20] w-full mb-4 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Logging In...' : 'Login'}
        </button>

        <div className="text-center text-sm">
          <p>
            Don’t have an account?{' '}
            <span
              onClick={() => navigate(`/${countryCode.toLowerCase() || 'ng'}/signup`)}
              className="cursor-pointer text-[#f47b20] underline"
            >
              Sign Up
            </span>
          </p>
          <p className="mt-2">
            <span
              onClick={() => navigate(`/${countryCode.toLowerCase() || 'ng'}/forgot-password`)}
              className="cursor-pointer text-[#0b0b5c] underline"
            >
              Forgot Password?
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
