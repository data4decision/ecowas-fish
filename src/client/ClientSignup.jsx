import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function ClientSignup() {
  const navigate = useNavigate();
  const { countryCode } = useParams();
  const [surname, setSurname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  // Email validation regex
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Country code mapping (simplified)
  const countryPrefixes = {
    GH: '+233', // Ghana
    NG: '+234', // Nigeria
  };

  // Validate if phone number matches the expected country code
  const isValidCountry = (phone, expectedCountryCode) => {
    const prefix = countryPrefixes[expectedCountryCode.toUpperCase()];
    return phone && phone.startsWith(prefix);
  };

  const handleSignup = async () => {
    setError('');
    const expectedCountryCode = countryCode?.toUpperCase() || 'GH'; // Default to GH if not provided

    // Validate inputs
    if (!surname || !firstName || !lastName || !email || !password || !phone) {
      setError('All fields are required.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Check if the phone number matches the expected country
    if (!isValidCountry(phone, expectedCountryCode)) {
      setError(`This signup is for ${expectedCountryCode === 'GH' ? 'Ghana' : 'Nigeria'} only. Please use a ${countryPrefixes[expectedCountryCode]} phone number.`);
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        surname,
        firstName,
        lastName,
        email,
        phone,
        role: 'client',
        countryCode: expectedCountryCode,
        createdAt: new Date().toISOString(),
      });

      navigate(`/${countryCode.toLowerCase() || 'gh'}/login`);
    } catch (err) {
      setError(`Signup failed: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-[#0b0b5c] px-4">
      <form onSubmit={(e) => e.preventDefault()} className="bg-white shadow-md border border-[#f47b20] rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#0b0b5c]">Client Sign Up</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value.trim())}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value.trim())}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value.trim())}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
          />
        </div>
        <div className="mb-4">
          <input
            type="tel"
            placeholder={`Phone Number (e.g., ${countryPrefixes[countryCode?.toUpperCase() || 'GH']}...)`}
            value={phone}
            onChange={(e) => setPhone(e.target.value.trim())}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
          />
        </div>

        <button
          onClick={handleSignup}
          className="w-full bg-[#0b0b5c] text-white p-3 rounded hover:bg-[#f47b20] disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        <p className="text-center mt-4">
          Already have an account?{' '}
          <span
            onClick={() => navigate(`/${countryCode?.toLowerCase() || 'gh'}/login`)}
            className="text-[#0b0b5c] cursor-pointer underline hover:text-[#f47b20]"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}