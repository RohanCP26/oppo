
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-oppo-primary">Oppo</span>
          <span className="text-sm text-gray-500 hidden sm:inline">Research Opportunities</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-700 hover:text-oppo-primary transition">Home</Link>
          <Link to="/find-professors" className="text-gray-700 hover:text-oppo-primary transition">Find Professors</Link>
          <Button variant="default" asChild>
            <Link to="/find-professors" className="bg-oppo-primary hover:bg-purple-600">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
