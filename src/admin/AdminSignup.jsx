import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AdminSignup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Basic email format validation
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Admin email must contain '_d4d' in the local part (before @)
  const isAdminEmail = (email) => /^[^\s@]+_d4d@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!fullName || !email || !password || !confirmPassword) {
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
      setError('Invalid email format.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        fullName,
        role: 'admin',
        createdAt: new Date().toISOString(),
      });

      setLoading(false);
      navigate('/admin/login');
    } catch (err) {
      setLoading(false);
      setError(
        err.code === 'auth/email-already-in-use'
          ? 'Email already in use.'
          : 'Signup failed. Please try again.'
      );
      console.error('Signup error:', err.code, err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form onSubmit={handleSignup} className="bg-white shadow-md border border-[#f47b20] rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#0b0b5c]">Admin Signup</h2>
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
        {loading && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#f47b20]"></div>
          </div>
        )}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value.trim())}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
            required
          />
        </div>
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
        <div className="mb-4">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value.trim())}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#0b0b5c] text-white p-3 rounded hover:bg-[#f47b20] disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/admin/login')}
            className="text-[#0b0b5c] cursor-pointer underline hover:text-[#f47b20]"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default AdminSignup;