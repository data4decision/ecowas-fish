import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { useTranslation } from 'react-i18next';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isAdminEmail = (email) => /^[^\s@]+_d4d@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError(t('admin_login_page.errors.empty_fields'));
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError(t('admin_login_page.errors.invalid_email'));
      setLoading(false);
      return;
    }

    if (!isAdminEmail(email)) {
      setError(t('admin_login_page.errors.incorrect'));
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
          setError(t('admin_login_page.errors.access_denied'));
        }
      } else {
        await auth.signOut();
        setError(t('admin_login_page.errors.not_found'));
      }
    } catch (err) {
      setError(t('admin_login_page.errors.incorrect'));
      console.error('Login error:', err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/admin/forgot-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b5c] px-4">
      <form onSubmit={handleLogin} className="bg-white shadow-md border border-[#f47b20] rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#0b0b5c]">{t('admin_login_page.title')}</h2>
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
        {loading && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#f47b20]"></div>
          </div>
        )}

        <div className="mb-4">
          <input
            type="email"
            placeholder={t('admin_login_page.email_placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder={t('admin_login_page.password_placeholder')}
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
          {loading ? t('admin_login_page.logging_in') : t('admin_login_page.login_button')}
        </button>

        <div className="text-center mt-4 text-sm">
          <p>
            <span
              onClick={handleForgotPassword}
              className="text-[#0b0b5c] cursor-pointer underline hover:text-[#f47b20]"
            >
              {t('admin_login_page.forgot_password')}
            </span>
          </p>
          <p className="mt-2">
            {t('admin_login_page.no_account')}{' '}
            <span
              onClick={() => navigate('/admin/signup')}
              className="text-[#0b0b5c] cursor-pointer underline hover:text-[#f47b20]"
            >
              {t('admin_login_page.signup')}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
