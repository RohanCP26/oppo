
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Mail, Search, Text } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// This would come from the backend in a real app
const mockProfessors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    university: "Stanford University",
    department: "Computer Science",
    researchArea: "Artificial Intelligence",
    location: "California",
    email: "sarah.chen@stanford.edu",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: 2,
    name: "Dr. Michael Rodriguez",
    university: "MIT",
    department: "Physics",
    researchArea: "Quantum Computing",
    location: "Massachusetts",
    email: "mrodriguez@mit.edu",
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: 3,
    name: "Dr. Emily Johnson",
    university: "UC Berkeley",
    department: "Biology",
    researchArea: "Genetics",
    location: "California",
    email: "ejohnson@berkeley.edu",
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: 4,
    name: "Dr. David Wilson",
    university: "Harvard University",
    department: "Chemistry",
    researchArea: "Biochemistry",
    location: "Massachusetts",
    email: "dwilson@harvard.edu",
    profileImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: 5,
    name: "Dr. James Parker",
    university: "UCLA",
    department: "Computer Science",
    researchArea: "Machine Learning",
    location: "California",
    email: "jparker@ucla.edu",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: 6,
    name: "Dr. Lisa Thompson",
    university: "Princeton University",
    department: "Economics",
    researchArea: "Behavioral Economics",
    location: "New Jersey",
    email: "lthompson@princeton.edu",
    profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
  }
];

const locations = ["All Locations", "California", "Massachusetts", "New Jersey"];
const subjects = ["All Subjects", "Computer Science", "Physics", "Biology", "Chemistry", "Economics"];

const FindProfessors = () => {
  const { toast } = useToast();
  const [professors, setProfessors] = useState(mockProfessors);
  const [location, setLocation] = useState("All Locations");
  const [subject, setSubject] = useState("All Subjects");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedProfessors, setSelectedProfessors] = useState<number[]>([]);
  const [emailTemplateConfigured, setEmailTemplateConfigured] = useState(false);

  const handleSearch = () => {
    let filtered = mockProfessors;

    if (location !== "All Locations") {
      filtered = filtered.filter(prof => prof.location === location);
    }

    if (subject !== "All Subjects") {
      filtered = filtered.filter(prof => prof.department === subject);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prof => 
        prof.name.toLowerCase().includes(query) || 
        prof.university.toLowerCase().includes(query) ||
        prof.researchArea.toLowerCase().includes(query)
      );
    }

    setProfessors(filtered);
    toast({
      title: "Search Results Updated",
      description: `Found ${filtered.length} professors matching your criteria.`
    });
  };

  const toggleProfessorSelection = (id: number) => {
    if (selectedProfessors.includes(id)) {
      setSelectedProfessors(selectedProfessors.filter(profId => profId !== id));
    } else {
      setSelectedProfessors([...selectedProfessors, id]);
    }
  };

  const handleColdEmail = () => {
    if (selectedProfessors.length === 0) {
      toast({
        title: "No professors selected",
        description: "Please select at least one professor to cold email.",
        variant: "destructive"
      });
      return;
    }
    setIsPaymentDialogOpen(true);
  };

  const handlePayment = () => {
    // This would connect to a payment processor in a real app
    toast({
      title: "Payment Successful!",
      description: `Cold emails sent to ${selectedProfessors.length} professors.`,
    });
    setIsPaymentDialogOpen(false);
    setSelectedProfessors([]);
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Find Research Professors</h1>
          
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {locations.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {subjects.map(sub => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="Search by name, university, or research area" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <Button onClick={handleSearch} className="bg-oppo-primary hover:bg-purple-600">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
          </div>
          
          {/* Selected Count, Email Template and Cold Email Button */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <p className="text-gray-700">
              {selectedProfessors.length} professors selected
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                asChild
                className="border-oppo-primary text-oppo-primary hover:bg-oppo-light"
              >
                <Link to="/email-template">
                  <Text className="mr-2 h-4 w-4" /> Customize Email Template
                </Link>
              </Button>
              <Button 
                onClick={handleColdEmail} 
                disabled={selectedProfessors.length === 0}
                className="bg-oppo-primary hover:bg-purple-600"
              >
                <Mail className="mr-2 h-4 w-4" /> Cold Email Selected
              </Button>
            </div>
          </div>
          
          {/* Professor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professors.map(professor => (
              <Card key={professor.id} className={`${selectedProfessors.includes(professor.id) ? 'border-oppo-primary border-2' : ''}`}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <img 
                    src={professor.profileImage} 
                    alt={professor.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle>{professor.name}</CardTitle>
                    <CardDescription>{professor.university}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Department:</span> {professor.department}
                    </div>
                    <div>
                      <span className="font-medium">Research Area:</span> {professor.researchArea}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {professor.location}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {professor.email}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={selectedProfessors.includes(professor.id) ? "default" : "outline"} 
                    className={`w-full ${selectedProfessors.includes(professor.id) ? 'bg-oppo-primary hover:bg-purple-600' : 'border-oppo-primary text-oppo-primary hover:bg-oppo-light'}`}
                    onClick={() => toggleProfessorSelection(professor.id)}
                  >
                    {selectedProfessors.includes(professor.id) ? 'Selected' : 'Select for Cold Email'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {professors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No professors found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Payment</DialogTitle>
            <DialogDescription>
              Send cold emails to {selectedProfessors.length} selected professors.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Campaign Details</label>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium">Number of professors: {selectedProfessors.length}</p>
                <p className="font-medium">Price per email: $1.99</p>
                <p className="text-lg font-bold mt-2">Total: ${(selectedProfessors.length * 1.99).toFixed(2)}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Card Information</label>
              <Input type="text" placeholder="Card number" />
              <div className="grid grid-cols-2 gap-4">
                <Input type="text" placeholder="MM/YY" />
                <Input type="text" placeholder="CVC" />
              </div>
              <Input type="text" placeholder="Cardholder name" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePayment} className="bg-oppo-primary hover:bg-purple-600">
              Pay ${(selectedProfessors.length * 1.99).toFixed(2)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default FindProfessors;
