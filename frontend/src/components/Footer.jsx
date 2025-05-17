

import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-indigo-100 via-white to-indigo-100 border-t border-gray-300 mt-12 text-gray-700">
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Branding and description */}
          <div>
            <h2 className="text-3xl font-extrabold mb-4 text-indigo-700">LearnX</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Empowering learners everywhere with quality education and interactive learning experiences.
            </p>

          </div>

          {/* Navigation */}
          <nav aria-label="Footer Navigation">
            <h3 className="mb-4 font-semibold text-indigo-700">Navigate</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>
                <Link
                  to="/"
                  className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/discussion"
                  className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                >
                  Discussion
                </Link>
              </li>
            </ul>
          </nav>

          {/* Support */}
          <nav aria-label="Footer Support">
            <h3 className="mb-4 font-semibold text-indigo-700">Support</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                  rel="noopener noreferrer"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                  rel="noopener noreferrer"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-gray-300 py-4 text-center text-sm text-gray-500 max-w-7xl mx-auto">
        &copy; {new Date().getFullYear()} LearnX. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
