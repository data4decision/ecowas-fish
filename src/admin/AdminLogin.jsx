import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Basic email format validation
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Admin email must contain '_d4d' in the local part (before @)
  const isAdminEmail = (email) => /^[^\s@]+_d4d@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError('Invalid email format.');
      setLoading(false);
      return;
    }

    if (!isAdminEmail(email)) {
      setError('Incorrect email or password.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          await auth.signOut();
          setError('Access denied. Unauthorized role.');
        }
      } else {
        await auth.signOut();
        setError('User not found.');
      }
    } catch (err) {
      setError('Incorrect email or password.');
      console.error('Login error:', err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/admin/forgot-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form onSubmit={handleLogin} className="bg-white shadow-md border border-[#f47b20] rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#0b0b5c]">Admin Login</h2>
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
        {loading && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#f47b20]"></div>
          </div>
        )}

        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#0b0b5c] text-white p-3 rounded hover:bg-[#f47b20] disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Logging In...' : 'Login'}
        </button>

        <div className="text-center mt-4 text-sm">
          <p>
            <span
              onClick={handleForgotPassword}
              className="text-[#0b0b5c] cursor-pointer underline hover:text-[#f47b20]"
            >
              Forgot password?
            </span>
          </p>
          <p className="mt-2">
            Don’t have an account?{' '}
            <span
              onClick={() => navigate('/admin/signup')}
              className="text-[#0b0b5c] cursor-pointer underline hover:text-[#f47b20]"
            >
              Sign up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;