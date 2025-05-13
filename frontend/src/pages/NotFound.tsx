
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-oppo-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="bg-oppo-primary hover:bg-purple-600">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default NotFound;
