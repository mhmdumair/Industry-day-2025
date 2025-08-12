"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw, Building, Users, Clock, MapPin } from 'lucide-react';
import api from '../../../lib/axios';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

const LiveQueueDisplay = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [prelistedInterviews, setPrelistedInterviews] = useState<Interview[]>([]);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [walkinQueues, setWalkinQueues] = useState<Record<string, Interview[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCompanies, setLoadingCompanies] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
        setError('Failed to load companies. Please check your connection and try again.');
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
      // 1. Fetch prelisted interviews
      const prelistedData = await apiGet(`/interview/company/${companyId}/prelisted/inqueue`);
      setPrelistedInterviews(prelistedData || []);

      // 2. Fetch stalls for the company
      const stallsData = await apiGet(`/stall/company/${companyId}`);
      setStalls(stallsData || []);

      // 3. Fetch walk-in interviews for each stall
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
      }
      setWalkinQueues(walkinData);
      setLastUpdated(new Date());

    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError('Failed to load queue data. Please try again.');
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'in_queue': return 'default';
      case 'in_progress': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getSponsorshipVariant = (sponsorship: string) => {
    switch (sponsorship) {
      case 'MAIN': return 'default';
      case 'GOLD': return 'secondary';
      case 'SILVER': return 'outline';
      case 'BRONZE': return 'destructive';
      default: return 'default';
    }
  };

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const selectedCompanyData = companies.find(c => c.companyID === selectedCompany);
  
  // Calculate total walk-in interviews
  const totalWalkinInterviews = Object.values(walkinQueues).reduce((total, interviews) => total + interviews.length, 0);
  const totalInterviews = prelistedInterviews.length + totalWalkinInterviews;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <Card className="text-center space-y-2 bg-slate-100/80">
        <CardHeader>
        <CardTitle className="text-2xl font-bold">Live Queue Dashboard</CardTitle>
        {lastUpdated && (
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
        </CardHeader>

        <CardContent>
      {/* Company Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              Select Company
            </div>
            {selectedCompany && (
              <Button onClick={refreshData} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingCompanies ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading companies...
            </div>
          ) : (
              <Select value={selectedCompany} onValueChange={handleCompanyChange}>
                <SelectTrigger className="max-w-full truncate">
                  <SelectValue
                      placeholder="Choose a company"
                      className="truncate"
                  />
                </SelectTrigger>
                <SelectContent className="selected">
                  {companies.map((company) => (
                      <SelectItem
                          key={company.companyID}
                          value={company.companyID}
                          className="max-w-full truncate"
                      >
                        {company.companyName} ({company.sponsership})
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>

          )}
          
          {companies.length === 0 && !loadingCompanies && (
            <Alert>
              <AlertDescription>
                No companies found. Please check your API connection.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Company Information */}
      {selectedCompanyData && (
        <Card className="mt-2 mb-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedCompanyData.companyName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>Contact: {selectedCompanyData.contactPersonName} ({selectedCompanyData.contactPersonDesignation})</div>
              <div>Phone: {selectedCompanyData.contactNumber}</div>
              <div>Email: {selectedCompanyData.user.email}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading queue data...
        </div>
      )}

      {/* Statistics */}
      {selectedCompany && !loading && !error && (
        <div className="flex ">
          <Card className="mt-2 mb-2 flex flex-col gap-4 items-center justify-center w-full">
            <CardContent className="flex items-center gap-4 p-6">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{totalInterviews}</p>
              </div>
              <div>
              <p className="text-sm text-muted-foreground">Pre-listed</p>
              <p className="text-2xl font-bold">{prelistedInterviews.length}</p>
            </div>
              <div>
              <p className="text-sm text-muted-foreground">Walk-in</p>
              <p className="text-2xl font-bold">{totalWalkinInterviews}</p>
            </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pre-listed Interviews */}
      {selectedCompany && !loading && !error && (
        <Card className="mt-2 mb-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pre-listed Interviews ({prelistedInterviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prelistedInterviews.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Group/Level</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prelistedInterviews.map((interview) => (
                    <TableRow key={interview.interviewID}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {interview.student.user.first_name} {interview.student.user.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">{interview.student.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{interview.student.regNo}</TableCell>
                      <TableCell>
                        <div>{interview.student.group}</div>
                        <div className="text-sm text-muted-foreground">{interview.student.level.replace('_', ' ')}</div>
                      </TableCell>
                      <TableCell>{interview.student.contact}</TableCell>
                      <TableCell>
                        <Badge variant="outline">#{interview.company_preference}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTime(interview.created_at)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(interview.status)}>
                          {interview.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No pre-listed interviews in queue
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Walk-in Interviews */}
      {selectedCompany && !loading && !error && (
        <Card className="mt-2 mb-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              Walk-in Interviews ({totalWalkinInterviews})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {stalls.length > 0 ? (
              stalls.map((stall) => {
                const stallInterviews = walkinQueues[stall.stallID] || [];
                return (
                  <Card key={stall.stallID}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {stall.title} ({stallInterviews.length} students)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {stallInterviews.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Student</TableHead>
                              <TableHead>Registration</TableHead>
                              <TableHead>Group/Level</TableHead>
                              <TableHead>Contact</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {stallInterviews.map((interview) => (
                              <TableRow key={interview.interviewID}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">
                                      {interview.student.user.first_name} {interview.student.user.last_name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{interview.student.user.email}</div>
                                  </div>
                                </TableCell>
                                <TableCell className="font-mono">{interview.student.regNo}</TableCell>
                                <TableCell>
                                  <div>{interview.student.group}</div>
                                  <div className="text-sm text-muted-foreground">{interview.student.level.replace('_', ' ')}</div>
                                </TableCell>
                                <TableCell>{interview.student.contact}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatTime(interview.created_at)}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={getStatusVariant(interview.status)}>
                                    {interview.status.replace('_', ' ')}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No walk-in interviews for this stall
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No stalls available for this company
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
        {selectedCompany && !loading && !error && totalInterviews === 0 && (
          <Card>
            <CardDescription className="text-center py-12 px-2">
              <CardTitle className="text-lg text-black mb-2">No interviews scheduled</CardTitle>
              <p className="text-muted-foreground">This company currently has no interviews in their queue</p>
            </CardDescription>
          </Card>
        )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveQueueDisplay;