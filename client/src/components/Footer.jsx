// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      client/src/components/Footer.jsx
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-light-gray mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-400">
        <p>&copy; {currentYear} eHUB. All Rights Reserved.</p>
        <p className="text-sm mt-1">A MERN Stack E-commerce Project</p>
      </div>
    </footer>
  );
};

export default Footer;