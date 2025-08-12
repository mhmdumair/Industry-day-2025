"use client";
import React, { useState, useEffect } from 'react';
import { FileText, Download, Building2, Calendar, User, MapPin, Clock } from 'lucide-react';

interface Interview {
    id: string;
    companyId: string;
    candidateName: string;
    position: string;
    interviewDate: string;
    interviewType: string; // 'phone', 'video', 'in-person', 'technical'
    status: string; // 'scheduled', 'completed', 'cancelled', 'no-show'
    duration: number; // in minutes
    interviewer: string;
    location?: string;
    notes: string;
    rating?: number; // 1-5 scale
    feedback: string;
    salary?: number;
    nextSteps?: string;
}

interface Company {
    id: string;
    name: string;
    industry: string;
    location: string;
    website?: string;
}

export default function InterviewReportGenerator() {
    const [companyId, setCompanyId] = useState<string>('');
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string>('');

    // Extract company ID from URL
    useEffect(() => {
        const extractCompanyId = () => {
            const urlParams = new URLSearchParams(window.location.search);

            // Try different URL patterns
            let id = urlParams.get('companyId') ||
                urlParams.get('company_id') ||
                urlParams.get('id');

            // If not in query params, try path segments
            if (!id) {
                const pathSegments = window.location.pathname.split('/');
                const companyIndex = pathSegments.findIndex(segment =>
                    segment.toLowerCase().includes('company')
                );
                if (companyIndex !== -1 && companyIndex < pathSegments.length - 1) {
                    id = pathSegments[companyIndex + 1];
                }
                // Fallback: assume last segment is the ID if it looks like an ID
                else if (pathSegments.length > 1) {
                    const lastSegment = pathSegments[pathSegments.length - 1];
                    if (lastSegment && (lastSegment.length > 5 || /^\d+$/.test(lastSegment))) {
                        id = lastSegment;
                    }
                }
            }

            if (id) {
                setCompanyId(id);
            } else {
                setError('Company ID not found in URL. Please ensure the URL contains a valid company identifier.');
            }
        };

        extractCompanyId();
    }, []);

    // Mock data generator (replace with actual API calls)
    const generateMockData = (companyId: string): { interviews: Interview[], company: Company } => {
        const company: Company = {
            id: companyId,
            name: `TechCorp Solutions ${companyId}`,
            industry: 'Technology',
            location: 'San Francisco, CA',
            website: 'https://techcorp.com'
        };

        const interviewTypes = ['phone', 'video', 'in-person', 'technical'];
        const statuses = ['completed', 'scheduled', 'cancelled'];
        const positions = ['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer', 'DevOps Engineer'];
        const interviewers = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Lisa Anderson', 'David Wilson'];

        const interviews: Interview[] = Array.from({ length: Math.floor(Math.random() * 15) + 5 }, (_, i) => ({
            id: `INT-${companyId}-${String(i + 1).padStart(3, '0')}`,
            companyId,
            candidateName: `Candidate ${String.fromCharCode(65 + i)} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i % 5]}`,
            position: positions[i % positions.length],
            interviewDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            interviewType: interviewTypes[i % interviewTypes.length],
            status: statuses[i % statuses.length],
            duration: 30 + Math.floor(Math.random() * 90),
            interviewer: interviewers[i % interviewers.length],
            location: i % 3 === 0 ? 'Conference Room A' : undefined,
            notes: `Interview notes for ${positions[i % positions.length]} position. Candidate showed ${['excellent', 'good', 'adequate'][Math.floor(Math.random() * 3)]} technical skills.`,
            rating: Math.floor(Math.random() * 5) + 1,
            feedback: `${['Strong', 'Good', 'Average'][Math.floor(Math.random() * 3)]} candidate with ${['excellent', 'solid', 'basic'][Math.floor(Math.random() * 3)]} experience.`,
            salary: 80000 + Math.floor(Math.random() * 120000),
            nextSteps: i % 2 === 0 ? 'Schedule second round' : 'Awaiting decision'
        }));

        return { interviews, company };
    };

    const fetchInterviewData = async () => {
        if (!companyId) {
            setError('No company ID available');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Replace this with actual API call
            // const response = await fetch(`/api/companies/${companyId}/interviews`);
            // const data = await response.json();

            const mockData = generateMockData(companyId);
            setInterviews(mockData.interviews);
            setCompany(mockData.company);

        } catch (err) {
            setError('Failed to fetch interview data. Please try again.');
            console.error('Error fetching data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const generateInterviewSummary = () => {
        if (!interviews.length) return null;

        const totalInterviews = interviews.length;
        const completedInterviews = interviews.filter(i => i.status === 'completed').length;
        const scheduledInterviews = interviews.filter(i => i.status === 'scheduled').length;
        const cancelledInterviews = interviews.filter(i => i.status === 'cancelled').length;

        const avgRating = interviews.filter(i => i.rating)
            .reduce((sum, i) => sum + (i.rating || 0), 0) / interviews.filter(i => i.rating).length;

        const positionCounts = interviews.reduce((acc, interview) => {
            acc[interview.position] = (acc[interview.position] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalInterviews,
            completedInterviews,
            scheduledInterviews,
            cancelledInterviews,
            avgRating: isNaN(avgRating) ? 0 : avgRating,
            positionCounts
        };
    };

    const generatePDF = () => {
        if (!company || !interviews.length) {
            setError('No data available to generate PDF');
            return;
        }

        setIsGenerating(true);

        const summary = generateInterviewSummary();
        const jsonData = {
            company,
            interviews,
            summary,
            generatedAt: new Date().toISOString()
        };

        // Create a new window with the report content
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow popups to generate the PDF');
            setIsGenerating(false);
            return;
        }

        const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Interview Report - ${company.name}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              max-width: 900px;
              margin: 0 auto;
              padding: 30px;
              line-height: 1.6;
              color: #2d3748;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #3182ce;
              padding-bottom: 25px;
              margin-bottom: 35px;
            }
            .header h1 {
              color: #2c5282;
              margin: 0 0 10px 0;
              font-size: 2.5em;
            }
            .company-info {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 25px;
              border-radius: 12px;
              margin-bottom: 30px;
            }
            .company-info h2 {
              margin: 0 0 15px 0;
              font-size: 1.8em;
            }
            .company-details {
              display: flex;
              flex-wrap: wrap;
              gap: 25px;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 35px;
            }
            .summary-card {
              background: #f7fafc;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              padding: 20px;
              text-align: center;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .summary-card h3 {
              margin: 0 0 10px 0;
              color: #4a5568;
              font-size: 0.9em;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .summary-card .number {
              font-size: 2.5em;
              font-weight: bold;
              color: #3182ce;
              margin: 0;
            }
            .positions-breakdown {
              background: #edf2f7;
              padding: 20px;
              border-radius: 10px;
              margin-bottom: 30px;
            }
            .positions-breakdown h3 {
              margin-top: 0;
              color: #2d3748;
            }
            .position-item {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #cbd5e0;
            }
            .position-item:last-child {
              border-bottom: none;
            }
            .interviews-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 25px;
              background: white;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            .interviews-table th {
              background: #4299e1;
              color: white;
              padding: 15px 12px;
              text-align: left;
              font-weight: 600;
              font-size: 0.9em;
            }
            .interviews-table td {
              padding: 12px;
              border-bottom: 1px solid #e2e8f0;
              font-size: 0.85em;
            }
            .interviews-table tr:nth-child(even) {
              background: #f8f9fa;
            }
            .status {
              padding: 4px 10px;
              border-radius: 15px;
              font-size: 0.8em;
              font-weight: 600;
              text-align: center;
              color: white;
            }
            .status.completed { background: #48bb78; }
            .status.scheduled { background: #4299e1; }
            .status.cancelled { background: #f56565; }
            .rating {
              color: #ed8936;
              font-weight: bold;
            }
            .json-section {
              margin-top: 40px;
              padding: 20px;
              background: #1a202c;
              border-radius: 8px;
              color: #e2e8f0;
            }
            .json-section h3 {
              color: #63b3ed;
              margin-top: 0;
            }
            .json-content {
              font-family: 'Courier New', monospace;
              font-size: 0.8em;
              white-space: pre-wrap;
              max-height: 400px;
              overflow-y: auto;
              background: #2d3748;
              padding: 15px;
              border-radius: 5px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              color: #718096;
              font-size: 0.9em;
            }
            @media print {
              body { margin: 0; padding: 15px; }
              .json-section { break-inside: avoid; page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Interview Report</h1>
            <p>Comprehensive analysis of interview data</p>
          </div>
          
          <div class="company-info">
            <h2>${company.name}</h2>
            <div class="company-details">
              <div><strong>Industry:</strong> ${company.industry}</div>
              <div><strong>Location:</strong> ${company.location}</div>
              <div><strong>Company ID:</strong> ${company.id}</div>
              ${company.website ? `<div><strong>Website:</strong> ${company.website}</div>` : ''}
            </div>
          </div>

          <div class="summary-grid">
            <div class="summary-card">
              <h3>Total Interviews</h3>
              <div class="number">${summary?.totalInterviews || 0}</div>
            </div>
            <div class="summary-card">
              <h3>Completed</h3>
              <div class="number">${summary?.completedInterviews || 0}</div>
            </div>
            <div class="summary-card">
              <h3>Scheduled</h3>
              <div class="number">${summary?.scheduledInterviews || 0}</div>
            </div>
            <div class="summary-card">
              <h3>Average Rating</h3>
              <div class="number">${summary?.avgRating ? summary.avgRating.toFixed(1) : 'N/A'}</div>
            </div>
          </div>

          <div class="positions-breakdown">
            <h3>Positions Interviewed</h3>
            ${Object.entries(summary?.positionCounts || {}).map(([position, count]) => `
              <div class="position-item">
                <span>${position}</span>
                <strong>${count}</strong>
              </div>
            `).join('')}
          </div>

          <h3>Interview Details</h3>
          <table class="interviews-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Position</th>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Interviewer</th>
              </tr>
            </thead>
            <tbody>
              ${interviews.map(interview => `
                <tr>
                  <td><strong>${interview.candidateName}</strong></td>
                  <td>${interview.position}</td>
                  <td>${new Date(interview.interviewDate).toLocaleDateString()}</td>
                  <td>${interview.interviewType}</td>
                  <td><span class="status ${interview.status}">${interview.status}</span></td>
                  <td class="rating">${interview.rating ? '★'.repeat(interview.rating) : 'N/A'}</td>
                  <td>${interview.interviewer}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="json-section">
            <h3>Complete Data (JSON)</h3>
            <div class="json-content">${JSON.stringify(jsonData, null, 2)}</div>
          </div>

          <div class="footer">
            <p>Report generated on ${new Date().toLocaleString()}</p>
            <p>Company ID: ${company.id} | Total Records: ${interviews.length}</p>
          </div>
        </body>
      </html>
    `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for content to load, then print
        setTimeout(() => {
            printWindow.print();
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Building2 className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Report Generator</h1>
                        <p className="text-gray-600 text-lg">Generate comprehensive PDF reports for company interviews</p>
                    </div>

                    {/* Company ID Display */}
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-center gap-4">
                            <Building2 className="w-8 h-8 text-blue-600" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Company ID</h3>
                                <p className="text-2xl font-bold text-blue-600">{companyId || 'Not found'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                <p className="text-red-800 font-medium">Error</p>
                            </div>
                            <p className="text-red-700 mt-2">{error}</p>
                        </div>
                    )}

                    {/* Fetch Data Button */}
                    {!interviews.length && (
                        <div className="text-center mb-8">
                            <button
                                onClick={fetchInterviewData}
                                disabled={isLoading || !companyId}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 transition-all duration-200 text-lg"
                            >
                                <FileText className="w-6 h-6" />
                                {isLoading ? 'Loading Interview Data...' : 'Load Interview Data'}
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Fetching interview data for company {companyId}...</p>
                        </div>
                    )}

                    {/* Data Summary */}
                    {company && interviews.length > 0 && (
                        <div className="space-y-8">
                            {/* Company Info */}
                            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Building2 className="w-6 h-6 text-purple-600" />
                                    Company Information
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Company Name</p>
                                        <p className="font-semibold text-lg">{company.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Industry</p>
                                        <p className="font-semibold">{company.industry}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Location</p>
                                        <p className="font-semibold flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {company.location}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Interviews</p>
                                        <p className="font-semibold text-2xl text-blue-600">{interviews.length}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Completed', value: interviews.filter(i => i.status === 'completed').length, color: 'green' },
                                    { label: 'Scheduled', value: interviews.filter(i => i.status === 'scheduled').length, color: 'blue' },
                                    { label: 'Cancelled', value: interviews.filter(i => i.status === 'cancelled').length, color: 'red' },
                                    { label: 'Avg Rating', value: (interviews.filter(i => i.rating).reduce((sum, i) => sum + (i.rating || 0), 0) / interviews.filter(i => i.rating).length || 0).toFixed(1), color: 'purple' }
                                ].map((stat, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 flex items-center justify-center`}>
                                                {index === 0 && <Clock className={`w-6 h-6 text-${stat.color}-600`} />}
                                                {index === 1 && <Calendar className={`w-6 h-6 text-${stat.color}-600`} />}
                                                {index === 2 && <User className={`w-6 h-6 text-${stat.color}-600`} />}
                                                {index === 3 && <FileText className={`w-6 h-6 text-${stat.color}-600`} />}
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">{stat.label}</p>
                                                <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Generate PDF Button */}
                            <div className="text-center pt-6">
                                <button
                                    onClick={generatePDF}
                                    disabled={isGenerating}
                                    className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 transition-all duration-200 text-lg"
                                >
                                    <Download className="w-6 h-6" />
                                    {isGenerating ? 'Generating PDF Report...' : 'Generate Summary PDF'}
                                </button>
                            </div>

                            <div className="text-center text-sm text-gray-600 mt-4 space-y-1">
                                <p>The PDF will include all interview data, statistics, and the complete JSON dataset.</p>
                                <p>Report will open in a new window where you can save or print it.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}