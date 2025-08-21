import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {new Date().getFullYear()} Fantasy Piping League. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="mailto:fantasypipingleague@gmail.com" className="text-sm hover:text-gray-300 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;