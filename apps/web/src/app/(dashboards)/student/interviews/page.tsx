"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Clock, CheckCircle } from "lucide-react";
import axios from 'axios';

// Types based on your entity structure
interface Company {
  companyID: string;
  userID: string;
  companyName: string;
  description: string;
  contactPersonName: string;
  contactPersonDesignation: string;
  contactNumber: string;
  logo: string | null;
  stream: string;
  sponsership: string;
  location: string;
  companyWebsite: string;
  user: {
    userID: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
    created_at: string;
    updated_at: string;
  };
}

interface Interview {
  interviewID: string;
  stallID?: string;
  companyID: string;
  studentID: string;
  type: 'pre-listed' | 'walk-in';
  status: 'scheduled' | 'completed' | 'cancelled';
  remark?: string;
  student_preference: number;
  company_preference: number;
  created_at: string;
  stall: any;
  student: {
    studentID: string;
    userID: string;
    regNo: string;
    nic: string;
    linkedin: string | null;
    contact: string;
    group: string;
    level: string;
    created_at: string;
    user: {
      userID: string;
      email: string;
      role: string;
      first_name: string;
      last_name: string;
      profile_picture: string | null;
      created_at: string;
      updated_at: string;
    };
  };
}

const InterviewRegistration = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [registeredInterviews, setRegisteredInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [studentID, setStudentID] = useState<string | null>(null);

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const response = await axios.get('/api/company');
      setCompanies(response.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies');
    }
  };

  // Fetch registered interviews
  const fetchRegisteredInterviews = async () => {
    if (!studentID) return;
    
    try {
      const response = await axios.get(`/api/interview/student/${studentID}`);
      setRegisteredInterviews(response.data);
    } catch (err) {
      console.error('Error fetching interviews:', err);
      setError('Failed to load registered interviews');
    }
  };

  // Load data on component mount
  useEffect(() => {
    // Get studentID from URL query parameters (client-side only)
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('studentId');
    
    // If no studentID in query params, try to get from localStorage or use a hardcoded one for testing
    if (!id) {
      id = localStorage.getItem('studentID') || '0f88df86-24e1-40d7-a37d-cae00e64a5ac'; // Use one from your sample data
      console.warn('No studentID in URL params, using fallback:', id);
    }
    
    console.log('Setting studentID:', id);
    setStudentID(id);
  }, []);

  useEffect(() => {
    if (!studentID) return;
    
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCompanies(), fetchRegisteredInterviews()]);
      setLoading(false);
    };
    loadData();
  }, [studentID]);

  // Handle registration
  const handleRegister = async (companyID: string) => {
    if (!studentID) return;
    
    setRegistering(companyID);
    try {
      const response = await axios.post('/api/interview', {
        companyID,
        studentID,
        type: 'walk-in',
        status: 'scheduled',
        student_preference: 999,
        company_preference: 999,
      });

      // Refresh the data after successful registration
      await fetchRegisteredInterviews();
    } catch (err: any) {
      console.error('Error registering:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
    } finally {
      setRegistering(null);
    }
  };

  // Check if a company is already registered
  const isRegistered = (companyID: string) => {
    return registeredInterviews.some(interview => interview.companyID === companyID);
  };

  // Get company name by ID
  const getCompanyById = (companyID: string) => {
    return companies.find(company => company.companyID === companyID);
  };

  // Get stream badge color
  const getStreamBadgeColor = (stream: string) => {
    const colors = {
      CS: 'bg-red-200 border-red-400 text-black',
      CHEM: 'bg-blue-200 border-blue-400 text-black',
      EE: 'bg-green-200 border-green-400 text-black',
      ME: 'bg-purple-200 border-purple-400 text-black',
      CE: 'bg-yellow-200 border-yellow-400 text-black',
      DS: 'bg-indigo-200 border-indigo-400 text-black',
      AS: 'bg-pink-200 border-pink-400 text-black',
      ST: 'bg-orange-200 border-orange-400 text-black',
      ML: 'bg-teal-200 border-teal-400 text-black',
      BT: 'bg-cyan-200 border-cyan-400 text-black',
      ZL: 'bg-lime-200 border-lime-400 text-black',
      CM: 'bg-rose-200 border-rose-400 text-black',
    };
    return colors[stream as keyof typeof colors] || 'bg-gray-200 border-gray-400 text-black';
  };

  // Get status button configuration
  const getStatusButton = (status: string) => {
    switch (status) {
      case 'scheduled':
        return {
          variant: 'secondary' as const,
          className: 'border border-amber-400 bg-amber-100 w-full',
          icon: <Clock className="w-4 h-4 mr-2" />,
          text: 'In Queue'
        };
      case 'completed':
        return {
          variant: 'secondary' as const,
          className: 'border border-green-600 bg-green-100 w-full',
          icon: <CheckCircle className="w-4 h-4 mr-2" />,
          text: 'Completed'
        };
      case 'cancelled':
        return {
          variant: 'secondary' as const,
          className: 'border border-red-400 bg-red-100 w-full',
          icon: null,
          text: 'Cancelled'
        };
      default:
        return {
          variant: 'secondary' as const,
          className: 'border border-gray-400 bg-gray-100 w-full',
          icon: null,
          text: status
        };
    }
  };

  if (loading || !studentID) {
    return (
      <div className="mt-3 mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 mx-auto p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Card className="mt-3 bg-slate-100/80">
        <CardHeader>
          <CardTitle>Register for Interviews</CardTitle>
          <CardDescription>List of all available companies</CardDescription>
        </CardHeader>
        <CardContent>
          {companies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No companies available for registration
            </div>
          ) : (
            companies.map((company) => {
              const registered = isRegistered(company.companyID);
              const isCurrentlyRegistering = registering === company.companyID;

              return (
                <Card key={company.companyID} className="mb-2 last:mb-0 flex flex-col">
                  <CardHeader className="flex-1">
                    <CardTitle>{company.companyName}</CardTitle>
                    <CardDescription>
                      Stream:
                      <Badge className={`ml-1 mb-3 ${getStreamBadgeColor(company.stream)}`}>
                        {company.stream}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <div className="p-6 pt-0">
                    {registered ? (
                      <Button 
                        variant="secondary" 
                        className="border border-green-600 bg-green-100 w-full" 
                        disabled
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Already Registered
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        className="border border-black bg-blue-100 w-full"
                        onClick={() => handleRegister(company.companyID)}
                        disabled={isCurrentlyRegistering}
                      >
                        {isCurrentlyRegistering ? (
                          <>Loading...</>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Register
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </CardContent>
        <CardFooter className="m-0 text-center">
          <CardDescription>Your registered companies will be shown below</CardDescription>
        </CardFooter>
      </Card>

      <Card className="mt-3 bg-slate-100/80">
        <CardHeader>
          <CardTitle>Registered Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          {registeredInterviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No registered interviews yet
            </div>
          ) : (
            registeredInterviews.map((interview) => {
              const statusConfig = getStatusButton(interview.status);
              const company = getCompanyById(interview.companyID);
              const companyName = company?.companyName || `Company ${interview.companyID}`;
              const stream = company?.stream || 'N/A';

              return (
                <Card key={interview.interviewID} className="mb-2 last:mb-0 flex flex-col">
                  <CardHeader className="flex-1">
                    <CardTitle>{companyName}</CardTitle>
                    <CardDescription>
                      Stream:
                      <Badge className={`ml-1 mb-3 ${getStreamBadgeColor(stream)}`}>
                        {stream}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <div className="p-6 pt-0">
                    <Button 
                      variant={statusConfig.variant}
                      className={statusConfig.className}
                      disabled
                    >
                      {statusConfig.icon}
                      {statusConfig.text}
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewRegistration;