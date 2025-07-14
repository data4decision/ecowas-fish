import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAuth, confirmPasswordReset } from 'firebase/auth';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = getAuth();

  useEffect(() => {
    const urlActionCode = searchParams.get('oobCode');
    if (!urlActionCode) {
      setError('Invalid or expired reset link. Please request a new one.');
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [searchParams]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newPassword || !confirmPassword) {
      setError('Both fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const urlActionCode = searchParams.get('oobCode');
    if (!urlActionCode) {
      setError('Invalid reset link. Please request a new one.');
      return;
    }

    try {
      await confirmPasswordReset(auth, urlActionCode, newPassword);
      setMessage('Password has been reset successfully. You can now log in.');
      setTimeout(() => navigate(`/${searchParams.get('countryCode') || 'gh'}/login`), 2000);
    } catch (err) {
      setError(`Failed to reset password: ${err.message}`);
      console.error(err);
    }
  };

  if (!isValid) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md border border-[#f47b20]">
          <p className="text-red-600 text-center">{error}</p>
          <div className="mt-6 text-center">
            <span
              onClick={() => navigate(`/${searchParams.get('countryCode') || 'gh'}/forgot-password`)}
              className="text-[#0b0b5c] underline cursor-pointer hover:text-[#f47b20]"
            >
              Request a new reset link
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md border border-[#f47b20]">
        <h2 className="text-2xl font-bold mb-4 text-[#0b0b5c] text-center">Set New Password</h2>
        
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-[#0b0b5c]"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value.trim())}
        />
        
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-[#0b0b5c]"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value.trim())}
        />
        
        <button
          onClick={handleResetPassword}
          className="w-full bg-[#f47b20] text-white p-3 rounded hover:bg-[#e56710] transition disabled:bg-gray-400"
          disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
        >
          Reset Password
        </button>

        {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;