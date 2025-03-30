// components/Footer.js
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-150 py-4 border-t border-gray-300">
      <div className="container mx-auto text-center text-black">
        
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 text-2xl">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-400 text-2xl">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-700 text-2xl">
            <FaLinkedin />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-pink-600 text-2xl">
            <FaInstagram />
          </a>
        </div>
        <p className="mt-4">&copy; {new Date().getFullYear()} PROPEASE. All rights reserved.</p>
      </div>
    </footer>
  );
}
