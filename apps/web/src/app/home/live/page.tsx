"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronDown } from 'lucide-react';
import api from '../../../lib/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Company {
  companyID: string;
  companyName: string;
  description: string;
  contactPersonName: string;
  contactPersonDesignation: string;
  contactNumber: string;
  sponsership: string;
  location: string;
  companyWebsite: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

interface Student {
  studentID: string;
  regNo: string;
  nic: string;
  linkedin: string;
  contact: string;
  group: string;
  level: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

interface Stall {
  stallID: string;
  title: string;
  roomID: string;
  companyID: string;
  preference: string;
  status: string;
}

interface Interview {
  interviewID: string;
  stallID: string | null;
  companyID: string;
  studentID: string;
  type: "walk-in" | "pre-listed";
  status: string;
  remark: string | null;
  student_preference: number;
  company_preference: number;
  created_at: string;
  stall?: Stall | null;
  student: Student;
}

// Company brand colors mapping
const COMPANY_COLORS: Record<string, string> = {
  'MAS Holdings': 'red',
  'Creative Software': 'pink',
  'Aayu Technologies': 'orange',
  'Octave': 'blue',
  'Noritake Lanka Porcelain (Pvt) Limited':'blue',
  'Hutch Telecommunications Lanka Pvt Ltd':'orange',
  'Default': 'white'
};

const LiveQueueDisplay = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedStall, setSelectedStall] = useState<string>('');
  const [prelistedInterviews, setPrelistedInterviews] = useState<Interview[]>([]);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [walkinQueues, setWalkinQueues] = useState<Record<string, Interview[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCompanies, setLoadingCompanies] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<string>('prelisted');

  // API function using axios
  const apiGet = async (endpoint: string): Promise<any> => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      throw new Error(`API request failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        setError('');
        const data = await apiGet('/company');
        setCompanies(data || []);
      } catch (error: any) {
        console.error('Error fetching companies:', error);
        setError('Failed to load companies.');
        setCompanies([]);
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchCompanies();
  }, []);

  // Handle company selection and fetch all related data
  const handleCompanyChange = async (companyId: string): Promise<void> => {
    if (!companyId) {
      setSelectedCompany('');
      setPrelistedInterviews([]);
      setStalls([]);
      setWalkinQueues({});
      setLastUpdated(null);
      return;
    }

    setSelectedCompany(companyId);
    setLoading(true);
    setError('');

    try {
      // Fetch prelisted interviews
      const prelistedData = await apiGet(`/interview/company/${companyId}/prelisted/inqueue`);
      setPrelistedInterviews(prelistedData || []);

      // Fetch stalls for the company
      const stallsData = await apiGet(`/stall/company/${companyId}`);
      setStalls(stallsData || []);

      // Fetch walk-in interviews for each stall
      const walkinData: Record<string, Interview[]> = {};
      if (stallsData && stallsData.length > 0) {
        for (const stall of stallsData) {
          try {
            const stallWalkinData = await apiGet(`/interview/stall/${stall.stallID}/inqueue`);
            walkinData[stall.stallID] = stallWalkinData || [];
          } catch (stallError: any) {
            console.error(`Error fetching walk-in data for stall ${stall.stallID}:`, stallError);
            walkinData[stall.stallID] = [];
          }
        }
        // Select first stall by default if available
        if (stallsData[0]) {
          setSelectedStall(stallsData[0].stallID);
        }
      }
      setWalkinQueues(walkinData);
      setLastUpdated(new Date());

    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError('Failed to load queue data.');
      setPrelistedInterviews([]);
      setStalls([]);
      setWalkinQueues({});
    } finally {
      setLoading(false);
    }
  };

  // Refresh data for selected company
  const refreshData = async (): Promise<void> => {
    if (selectedCompany) {
      await handleCompanyChange(selectedCompany);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'in_queue': { label: 'in-queue', className: 'bg-blue-500/50 border-1 border-blue-800 text-blue-950 dark:text-white rounded-full px-3 py-1' },
      'in_progress': { label: 'in-progress', className: 'bg-green-500/50 border-1 border-green-800 dark:text-white rounded-full px-3 py-1' },
      'completed': { label: 'finished', className: 'bg-orange-500/50 border-1 border-orange-800 dark:text-white rounded-full px-3 py-1' },
      'cancelled': { label: 'cancelled', className: 'bg-red-500/50 border-1 border-red-800 dark:text-white rounded-full px-3 py-1' }
    };
    
    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-500 text-white rounded-full px-3 py-1' };
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  const formatStudentInfo = (student: Student) => {
    return `S/${student.regNo.slice(-6)} • ${student.group} • ${student.level.replace('_', ' ')}`;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  // Get company color classes based on company name
  const getCompanyColorClasses = (companyName: string) => {
    // Get color from mapping or default
    const colorKey = COMPANY_COLORS[companyName] || COMPANY_COLORS['Default'];

    // Map brand colors to Tailwind classes
  const colorMap: Record<string, { trigger: string; border: string }> = {
  red: {
    trigger:
      'bg-red-500/70 dark:bg-red-600/50 text-white hover:bg-red-600/70 dark:hover:bg-red-700/70 border-1 border-red-700 dark:border-red-800',
    border: 'border-1 border-red-700 dark:border-red-800'
  },
  blue: {
    trigger:
      'bg-blue-500/70 dark:bg-blue-600/50 text-white hover:bg-blue-600/70 dark:hover:bg-blue-700/70 border-1 border-blue-700 dark:border-blue-800',
    border: 'border-1 border-blue-700 dark:border-blue-800'
  },
  green: {
    trigger:
      'bg-green-500/70 dark:bg-green-600/50 text-white hover:bg-green-600/70 dark:hover:bg-green-700/70 border-1 border-green-700 dark:border-green-800',
    border: 'border-1 border-green-700 dark:border-green-800'
  },
  purple: {
    trigger:
      'bg-purple-500/70 dark:bg-purple-600/50 text-white hover:bg-purple-600/70 dark:hover:bg-purple-700/70 border-1 border-purple-700 dark:border-purple-800',
    border: 'border-1 border-purple-700 dark:border-purple-800'
  },
  orange: {
    trigger:
      'bg-orange-500/70 dark:bg-orange-600/50 text-white hover:bg-orange-600/70 dark:hover:bg-orange-700/70 border-1 border-orange-700 dark:border-orange-800',
    border: 'border-1 border-orange-700 dark:border-orange-800'
  },
  yellow: {
    trigger:
      'bg-yellow-500/70 dark:bg-yellow-600/50 text-white hover:bg-yellow-600/70 dark:hover:bg-yellow-700/70 border-1 border-yellow-700 dark:border-yellow-800',
    border: 'border-1 border-yellow-700 dark:border-yellow-800'
  },
  pink: {
    trigger:
      'bg-pink-500/70 dark:bg-pink-600/50 text-white hover:bg-pink-600/70 dark:hover:bg-pink-700/70 border-1 border-pink-800 dark:border-pink-700',
    border: 'border-1 border-pink-800 dark:border-pink-700'
  },
  indigo: {
    trigger:
      'bg-indigo-500/70 dark:bg-indigo-600/50 text-white hover:bg-indigo-600/70 dark:hover:bg-indigo-700/70 border-1 border-indigo-700 dark:border-indigo-800',
    border: 'border-1 border-indigo-700 dark:border-indigo-800'
  },
  teal: {
    trigger:
      'bg-teal-500/70 dark:bg-teal-600/50 text-white hover:bg-teal-600/70 dark:hover:bg-teal-700/70 border-1 border-teal-700 dark:border-teal-800',
    border: 'border-1 border-teal-700 dark:border-teal-800'
  },
  white: {
    trigger:
      'bg-transparent dark:text-white hover:bg-gray-600/5 dark:hover:bg-white/5 border-1 border-black dark:border-gray-400',
    border: 'border-1 border-black dark:border-gray-400'
  }
  };

    return colorMap[colorKey.toLowerCase()] || colorMap.orange;
  };

  // Calculate statistics
  const totalWalkinInterviews = Object.values(walkinQueues).reduce((total, interviews) => total + interviews.length, 0);
  const currentStallInterviews = selectedStall ? (walkinQueues[selectedStall] || []) : [];

  // Get current company
  const currentCompany = companies.find(c => c.companyID === selectedCompany);
  const companyColors = getCompanyColorClasses(currentCompany?.companyName || 'Default');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Card className="rounded-none border-gray-200 dark:border-gray-800 bg-card text-card-foreground">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <CardTitle className="text-2xl font-semibold">Live Queues</CardTitle>
            <CardDescription>Select company to view live queue</CardDescription>
            <div className="flex items-center justify-between">
              <div>
                {lastUpdated && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Last updated : {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} pm
                  </p>
                )}
              </div>
              {selectedCompany && (
                <Button
                  onClick={refreshData}
                  disabled={loading}
                  className="rounded-none"
                  variant="secondary"
                >
                  Refresh
                  <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Company Selection */}
            <div className="w-full">
              {loadingCompanies ? (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  Loading companies...
                </div>
              ) : (
                <Select value={selectedCompany} onValueChange={handleCompanyChange}>
                  <SelectTrigger className={`w-full md:w-96 ${companyColors.trigger} rounded-none border-1`}>
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                    {companies.map((company) => (
                      <SelectItem
                        key={company.companyID}
                        value={company.companyID}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {company.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Statistics Cards */}
            {selectedCompany && !loading && (
              <div className="grid grid-cols-3 gap-4">
                <Card className="rounded-none border-gray-200 dark:border-gray-800 bg-card">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    <p className="text-3xl font-bold">{prelistedInterviews.length + totalWalkinInterviews}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-none border-gray-200 dark:border-gray-800 bg-card">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pre-listed</p>
                    <p className="text-3xl font-bold">{prelistedInterviews.length}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-none border-gray-200 dark:border-gray-800 bg-card">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Walk-in</p>
                    <p className="text-3xl font-bold">{totalWalkinInterviews}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tabs for Pre-listed and Walk-in */}
            {selectedCompany && !loading && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full md:w-auto bg-gray-100 dark:bg-gray-900 rounded-none p-0 h-auto">
                  <TabsTrigger
                    value="prelisted"
                    className="text-black dark:text-white rounded-none px-6 py-3 ml-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800/50 data-[state=active]:border-1 data-[state=active]:border-gray-400 dark:data-[state=active]:border-gray-600"
                  >
                    Pre-listed
                  </TabsTrigger>
                  <TabsTrigger
                    value="walkin"
                    className="text-black dark:text-white rounded-none px-6 py-3 ml-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800/50 data-[state=active]:border-1 data-[state=active]:border-gray-400 dark:data-[state=active]:border-gray-600"
                  >
                    Walk-in
                  </TabsTrigger>
                </TabsList>

                {/* Pre-listed Content */}
                <TabsContent value="prelisted" className="mt-6 space-y-4">
                  {prelistedInterviews.length > 0 ? (
                    <>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                          <div>Student</div>
                          <div className="text-center">Priority</div>
                          <div className="text-right">Status</div>
                        </div>
                        {prelistedInterviews.map((interview) => (
                          <div key={interview.interviewID} className="grid grid-cols-3 items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                  {getInitials(interview.student.user.first_name, interview.student.user.last_name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {interview.student.user.first_name} {interview.student.user.last_name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatStudentInfo(interview.student)}
                                </p>
                              </div>
                            </div>
                            <div className="text-center">
                              <span className="font-semibold">{interview.company_preference || '-'}</span>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(interview.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
                        A list of all pre-listed students.
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No pre-listed interviews in queue
                    </div>
                  )}
                </TabsContent>

                {/* Walk-in Content */}
                <TabsContent value="walkin" className="mt-6 space-y-4">
                  {stalls.length > 0 && (
                    <>
                      <Select value={selectedStall} onValueChange={setSelectedStall}>
                        <SelectTrigger className="w-full md:w-96 text-black dark:text-white bg-white dark:bg-gray-800 border-1 border-gray-400 dark:border-gray-600 rounded-none px-6 py-3 ml-1">
                          <SelectValue placeholder="Select Stall" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                          {stalls.map((stall) => (
                            <SelectItem
                              key={stall.stallID}
                              value={stall.stallID}
                              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              {stall.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedStall && (
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-none">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Queue Length: <span className="font-bold text-sm">{currentStallInterviews.length}</span>
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {currentStallInterviews.length > 0 ? (
                    <>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                          <div>Student</div>
                          <div className="text-right">Status</div>
                        </div>
                        {currentStallInterviews.map((interview) => (
                          <div key={interview.interviewID} className="grid grid-cols-2 items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                  {getInitials(interview.student.user.first_name, interview.student.user.last_name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {interview.student.user.first_name} {interview.student.user.last_name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatStudentInfo(interview.student)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(interview.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
                        A list of all walk-in students sorted by time of registration.
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      {stalls.length === 0 ? 'No stalls available for this company' : 'No walk-in interviews for this stall'}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Loading queue data...
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12 text-red-500 dark:text-red-400">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveQueueDisplay;