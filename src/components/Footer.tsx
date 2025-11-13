import Link from "next/link";
import { FaInstagram, FaFacebookF, FaTwitter, FaPinterestP } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">Jewelry Store</h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Discover timeless pieces crafted with love. Quality, elegance, and beauty in every design.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaPinterestP className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-lg font-normal text-white mb-4 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/rings" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/category/necklaces" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/category/bracelets" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/category/earrings" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Earrings
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-normal text-white mb-4 uppercase tracking-wider">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Help & FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-normal text-white mb-4 uppercase tracking-wider">Contact</h4>
            <address className="not-italic text-gray-400 text-sm space-y-3">
              <p>123 Jewelry Lane</p>
              <p>New York, NY 10001</p>
              <p>
                <a href="tel:+18005551234" className="hover:text-white transition-colors">
                  (800) 555-1234
                </a>
              </p>
              <p>
                <a href="mailto:info@jewelrystore.com" className="hover:text-white transition-colors">
                  info@jewelrystore.com
                </a>
              </p>
              <p className="pt-2">Mon-Fri: 9AM-6PM EST</p>
              <p>Sat: 10AM-4PM EST</p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-xs mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Jewelry Store. All rights reserved.
          </div>
          <div className="flex space-x-4 text-xs">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-gray-500 hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}