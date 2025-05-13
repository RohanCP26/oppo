
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const reviews = [
  {
    id: 1,
    text: "Thanks to Oppo, I secured a research position in my field within just two weeks. The AI matching was spot on!",
    name: "Alex Johnson",
    university: "Stanford University",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: 2,
    text: "I had been struggling to find research opportunities in neuroscience until I used Oppo. Their cold email templates are professional and effective.",
    name: "Sarah Miller",
    university: "MIT",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: 3,
    text: "The professor filtering saved me so much time. I found a perfect match for my research interests in sustainability science.",
    name: "Michael Chang",
    university: "UC Berkeley",
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
  }
];

const features = [
  {
    id: 1,
    title: "AI-Powered Matching",
    description: "Our advanced algorithms scan university websites to find professors actively researching in your field of interest."
  },
  {
    id: 2,
    title: "Automated Cold Emails",
    description: "Professionally crafted, personalized emails sent to multiple professors with just a single click."
  },
  {
    id: 3,
    title: "Filtering Options",
    description: "Narrow down professors by location, field of study, and research interests to find the perfect match."
  }
];

const Index = () => {
  return (
    <>
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-oppo-light to-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-oppo-dark mb-4">
                  Find Your Perfect Research Opportunity
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                  Oppo uses AI to connect students with professors for research opportunities. 
                  Get noticed with personalized cold emails and start your research journey today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-oppo-primary hover:bg-purple-600">
                    <Link to="/find-professors">Find Professors Now</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-oppo-primary text-oppo-primary hover:bg-oppo-light">
                    <Link to="/">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
                  alt="Students doing research" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How Oppo Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-oppo-light rounded-lg p-8 text-center">
                <div className="bg-oppo-primary w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold mb-3">Tell Us Your Interests</h3>
                <p className="text-gray-700">Share your research interests, location preferences, and academic background.</p>
              </div>
              
              <div className="bg-oppo-light rounded-lg p-8 text-center">
                <div className="bg-oppo-primary w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold mb-3">Browse Matched Professors</h3>
                <p className="text-gray-700">Review our AI-curated list of professors whose research aligns with your interests.</p>
              </div>
              
              <div className="bg-oppo-light rounded-lg p-8 text-center">
                <div className="bg-oppo-primary w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold mb-3">Send Personalized Emails</h3>
                <p className="text-gray-700">With one click, send professionally crafted, personalized emails to your selected professors.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Oppo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map(feature => (
                <div key={feature.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-3 text-oppo-primary">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map(review => (
                <div key={review.id} className="bg-gray-50 p-6 rounded-lg">
                  <p className="italic text-gray-700 mb-4">"{review.text}"</p>
                  <div className="flex items-center">
                    <img 
                      src={review.image} 
                      alt={review.name} 
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{review.name}</h4>
                      <p className="text-sm text-gray-600">{review.university}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-oppo-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Research Journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of students who have found research opportunities with Oppo.
            </p>
            <Button asChild size="lg" className="bg-white text-oppo-primary hover:bg-gray-100">
              <Link to="/find-professors">Find Professors Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Index;
