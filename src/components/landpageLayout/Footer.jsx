// src/components/Footer.jsx
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#0b0b5c] text-white py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold mb-2">Data4Decision Intionational</h3>
          <p className="text-sm text-gray-200">
            Advancing sustainable fisheries management through data-driven solutions across West Africa.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://www.data4decision.org/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-accent transition-colors"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-accent transition-colors"
              >
                Terms of Use
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
          <div className="flex space-x-4">
            <a
              href="https://web.facebook.com/profile.php?id=61577387353286"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-accent transition-colors"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/data4decision_intl/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-accent transition-colors"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://x.com/Data4_Decision"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-accent transition-colors"
            >
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center bg-black text-gray-400 text-sm mt-9 p-3">
        &copy; {new Date().getFullYear()} Data4Decision International. All rights reserved.
      </div>
    </footer>
    
    
  );
}
