import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';


const ClientSignup = () => {
  const navigate = useNavigate();
  const { countryCode } = useParams();
  const { t } = useTranslation();

  const [surname, setSurname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const countryPrefixes = {
  BJ: '+229', // Benin
  BF: '+226', // Burkina Faso
  CV: '+238', // Cape Verde
  CI: '+225', // Côte d'Ivoire
  GM: '+220', // The Gambia
  GH: '+233', // Ghana
  GN: '+224', // Guinea
  GW: '+245', // Guinea-Bissau
  LR: '+231', // Liberia
  ML: '+223', // Mali
  NE: '+227', // Niger
  NG: '+234', // Nigeria
  SN: '+221', // Senegal
  SL: '+232', // Sierra Leone
  TG: '+228', // Togo
};


  const isValidCountry = (phone, expectedCountryCode) => {
    const prefix = countryPrefixes[expectedCountryCode.toUpperCase()];
    return phone && phone.startsWith(prefix);
  };

  const handleSignup = async () => {
    setError('');
    const expectedCountryCode = countryCode?.toUpperCase() || 'GH';

    if (!surname || !firstName || !lastName || !email || !password || !phone) {
      setError(t('signup.errors.required'));
      return;
    }

    if (!isValidEmail(email)) {
      setError(t('signup.errors.invalid_email'));
      return;
    }

    if (password.length < 6) {
      setError(t('signup.errors.short_password'));
      return;
    }

    if (!isValidCountry(phone, expectedCountryCode)) {
      setError(
        t('signup.errors.invalid_country', {
          country: expectedCountryCode === 'GH' ? 'Ghana' : 'Nigeria',
          prefix: countryPrefixes[expectedCountryCode],
        })
      );
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

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
      setError(t('signup.errors.signup_failed', { message: err.message }));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="relative min-h-screen bg-[#0b0b5c] text-[#0b0b5c] px-4 flex items-center justify-center">
    {/* Language Switcher fixed to top-right corner */}
    <div className="absolute top-4 right-4">
      <LanguageSwitcher />
    </div>

    <form
      onSubmit={(e) => e.preventDefault()}
      className="bg-white shadow-md border border-[#f47b20] rounded px-8 pt-6 pb-8 w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-[#0b0b5c]">{t('signup.title')}</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="mb-4">
        <input
          type="text"
          placeholder={t('signup.surname')}
          value={surname}
          onChange={(e) => setSurname(e.target.value.trim())}
          required
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder={t('signup.firstName')}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value.trim())}
          required
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder={t('signup.lastName')}
          value={lastName}
          onChange={(e) => setLastName(e.target.value.trim())}
          required
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
        />
      </div>
      <div className="mb-4">
        <input
          type="email"
          placeholder={t('signup.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          required
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder={t('signup.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value.trim())}
          required
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f47b20]"
        />
      </div>
      <div className="mb-4">
        <input
          type="tel"
          placeholder={t('signup.phone', {
            prefix: countryPrefixes[countryCode?.toUpperCase() || 'GH'],
          })}
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
        {loading ? t('signup.loading') : t('signup.submit')}
      </button>

      <p className="text-center mt-4">
        {t('signup.login_prompt')}{' '}
        <span
          onClick={() => navigate(`/${countryCode?.toLowerCase() || 'gh'}/login`)}
          className="text-[#0b0b5c] cursor-pointer underline hover:text-[#f47b20]"
        >
          {t('signup.login_link')}
        </span>
      </p>
    </form>
  </div>
);

};

export default ClientSignup;
