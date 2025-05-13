
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Sample email template previews
const templatePreviews = {
  formal: "Dear Professor [Name], I am writing to express my interest in your research on [Research Area]. With my background in [Subject], I believe I could contribute meaningfully to your work...",
  casual: "Hi Professor [Name], I recently came across your fascinating work on [Research Area] and was really excited by it! As a student passionate about [Subject], I'd love to chat about possible ways to get involved...",
  detailed: "Dear Professor [Name], I am reaching out regarding potential research opportunities in your lab. Having studied your recent publication on [Research Area], I am particularly interested in the methodology you employed...",
  concise: "Professor [Name], I'm a [Major] student interested in your [Research Area] work. I have relevant experience in [Skill] and am seeking a research opportunity...",
};

const EmailTemplate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State for template preferences
  const [tone, setTone] = useState("formal");
  const [length, setLength] = useState("medium");
  const [emphasis, setEmphasis] = useState("skills");
  const [customization, setCustomization] = useState("");
  
  // Template selection display text
  const toneOptions = {
    formal: "Professional & Academic",
    casual: "Friendly & Approachable",
    enthusiastic: "Passionate & Enthusiastic",
    humble: "Modest & Respectful"
  };
  
  const lengthOptions = {
    short: "2-3 sentences",
    medium: "1 paragraph",
    detailed: "2+ paragraphs"
  };
  
  const emphasisOptions = {
    skills: "Technical Skills & Experience",
    interest: "Research Interest & Passion",
    alignment: "Alignment with Professor's Work",
    contribution: "Potential Contributions"
  };

  const handleSavePreference = () => {
    // In a real app, this would save to state or context that's accessible by the email sending feature
    toast({
      title: "Email preferences saved!",
      description: "Your email template preferences have been saved successfully."
    });
    
    // Navigate back to find professors page
    navigate("/find-professors");
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Customize Cold Email Template</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Template Options */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Email Template Preferences</CardTitle>
                  <CardDescription>
                    Select options that match your communication style and objectives
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tone Selection */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Tone</h3>
                    <RadioGroup 
                      defaultValue={tone} 
                      onValueChange={setTone}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      {Object.entries(toneOptions).map(([value, label]) => (
                        <div key={value} className="flex items-center space-x-2 border p-3 rounded-md">
                          <RadioGroupItem value={value} id={`tone-${value}`} />
                          <Label htmlFor={`tone-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  {/* Length Selection */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Email Length</h3>
                    <RadioGroup 
                      defaultValue={length} 
                      onValueChange={setLength}
                      className="grid grid-cols-1 md:grid-cols-3 gap-3"
                    >
                      {Object.entries(lengthOptions).map(([value, label]) => (
                        <div key={value} className="flex items-center space-x-2 border p-3 rounded-md">
                          <RadioGroupItem value={value} id={`length-${value}`} />
                          <Label htmlFor={`length-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  {/* Content Emphasis */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Content Emphasis</h3>
                    <Select value={emphasis} onValueChange={setEmphasis}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select what to emphasize" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.entries(emphasisOptions).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Custom Instructions */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Additional Customization</h3>
                    <Input
                      placeholder="E.g., Mention specific papers, include question about lab tours, etc."
                      value={customization}
                      onChange={(e) => setCustomization(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between flex-wrap gap-2">
                  <Button variant="outline" onClick={() => navigate("/find-professors")}>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePreference} className="bg-oppo-primary hover:bg-purple-600">
                    Save Email Preferences
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Preview Panel */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Template Preview</CardTitle>
                  <CardDescription>
                    How your email will generally appear
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-md border min-h-[300px] prose prose-sm max-w-none">
                    <p className="font-medium">Subject: Research Opportunity Inquiry</p>
                    <p className="mt-3">{templatePreviews[tone as keyof typeof templatePreviews] || templatePreviews.formal}</p>
                    
                    {length === "medium" || length === "detailed" ? (
                      <>
                        <p className="mt-2">I am particularly drawn to your research because [reason specific to professor].</p>
                        <p className="mt-2">My relevant experience includes [experience tailored to research area].</p>
                      </>
                    ) : null}
                    
                    {length === "detailed" ? (
                      <>
                        <p className="mt-2">I've also completed coursework in [relevant subjects] which has prepared me to contribute to your work.</p>
                        <p className="mt-2">I would be grateful for the opportunity to discuss how I might contribute to your research.</p>
                      </>
                    ) : null}
                    
                    <p className="mt-2">I look forward to your response.</p>
                    <p className="mt-2">Sincerely,</p>
                    <p>[Your Name]</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default EmailTemplate;
