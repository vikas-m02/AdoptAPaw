import Link from 'next/link';
import { FiHeart, FiInstagram, FiTwitter, FiFacebook, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4">AdoptAPaw</h3>
            <p className="text-gray-300 mb-4">
              Connecting loving homes with dogs in need. Our mission is to ensure every paw finds a family.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FiFacebook className="h-5 w-5" />
              </a>
              <a href="mailto:info@adoptapaw.com" className="text-gray-300 hover:text-white transition-colors">
                <FiMail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/home" className="text-gray-300 hover:text-white transition-colors">
                  Available Dogs
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                  How Adoption Works
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Adoption Guidelines</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">
                Must be at least 18 years old
              </li>
              <li className="text-gray-300">
                Stable housing situation
              </li>
              <li className="text-gray-300">
                Verification of identity
              </li>
              <li className="text-gray-300">
                Home visit approval
              </li>
              <li className="text-gray-300">
                Commitment to pet care
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="text-gray-300 not-italic">
              <p>🐾 Blue Cross of Hyderabad</p>
              <p>403/9, Road No. 35, Aditya Enclave, Venkatagiri, Jubilee Hills</p>
              <p>Hyderabad, Telangana 500033</p>
              <p className="mt-2">Phone: +91 8886676074</p>
              <p className='mt-2'>Email: info@bluecrossofhyd.org</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} AdoptAPaw. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-gray-400 text-sm mt-4 md:mt-0">
            <span>Made with</span>
            <FiHeart className="h-4 w-4 text-red-500" />
            <span>for our furry friends</span>
          </div>
        </div>
      </div>
    </footer>
  );
}