import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LiveQueueDisplay from '../page';
import api from '../../../../lib/axios';

// Mock the axios instance
jest.mock('../../../../lib/axios');

describe('Live Queue Display Page', () => {
  const mockCompanies = [
    {
      companyID: '1',
      companyName: 'MAS Holdings',
      description: 'Leading apparel company',
      contactPersonName: 'John Doe',
      contactPersonDesignation: 'HR Manager',
      contactNumber: '123456789',
      sponsership: 'MAIN',
      location: 'Colombo',
      companyWebsite: 'https://mas.com',
      user: {
        email: 'mas@test.com',
        first_name: 'John',
        last_name: 'Doe',
      },
    },
    {
      companyID: '2',
      companyName: 'Creative Software',
      description: 'Software development company',
      contactPersonName: 'Jane Smith',
      contactPersonDesignation: 'Manager',
      contactNumber: '987654321',
      sponsership: 'SILVER',
      location: 'Kandy',
      companyWebsite: 'https://creative.com',
      user: {
        email: 'creative@test.com',
        first_name: 'Jane',
        last_name: 'Smith',
      },
    },
  ];

  const mockStalls = [
    {
      stallID: 'stall1',
      title: 'Stall 1 - Main Hall',
      roomID: 'room1',
      companyID: '1',
      preference: 'main',
      status: 'active',
    },
    {
      stallID: 'stall2',
      title: 'Stall 2 - Conference Room',
      roomID: 'room2',
      companyID: '1',
      preference: 'secondary',
      status: 'active',
    },
  ];

  const mockPrelistedInterviews = [
    {
      interviewID: 'int1',
      stallID: null,
      companyID: '1',
      studentID: 'std1',
      type: 'pre-listed' as const,
      status: 'in_queue',
      remark: null,
      student_preference: 1,
      company_preference: 1,
      created_at: '2025-01-01T10:00:00Z',
      student: {
        studentID: 'std1',
        regNo: 'REG2021001',
        nic: '123456789V',
        linkedin: 'linkedin.com/student1',
        contact: '0771234567',
        group: 'Group A',
        level: 'level_3',
        user: {
          email: 'student1@test.com',
          first_name: 'Alice',
          last_name: 'Johnson',
        },
      },
    },
  ];

  const mockWalkinInterviews = [
    {
      interviewID: 'int2',
      stallID: 'stall1',
      companyID: '1',
      studentID: 'std2',
      type: 'walk-in' as const,
      status: 'in_progress',
      remark: null,
      student_preference: 0,
      company_preference: 0,
      created_at: '2025-01-01T11:00:00Z',
      student: {
        studentID: 'std2',
        regNo: 'REG2021002',
        nic: '987654321V',
        linkedin: 'linkedin.com/student2',
        contact: '0779876543',
        group: 'Group B',
        level: 'level_4',
        user: {
          email: 'student2@test.com',
          first_name: 'Bob',
          last_name: 'Williams',
        },
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockResolvedValue({ data: [] });
  });

  it('renders page title and description', () => {
    render(<LiveQueueDisplay />);

    expect(screen.getByText('Live Queues')).toBeInTheDocument();
    expect(screen.getByText('Select company to view live queue')).toBeInTheDocument();
  });

  it('shows loading spinner while fetching companies', () => {
    (api.get as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<LiveQueueDisplay />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('loads and displays companies in dropdown', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockCompanies });

    render(<LiveQueueDisplay />);

    await waitFor(() => {
      expect(screen.getByText('Select Company')).toBeInTheDocument();
    });

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);

    await waitFor(() => {
      expect(screen.getByText('MAS Holdings')).toBeInTheDocument();
      expect(screen.getByText('Creative Software')).toBeInTheDocument();
    });
  });

  it('displays error when companies fetch fails', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<LiveQueueDisplay />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load companies.')).toBeInTheDocument();
    });
  });

  it('fetches and displays queue data when company is selected', async () => {
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockCompanies })
      .mockResolvedValueOnce({ data: mockPrelistedInterviews })
      .mockResolvedValueOnce({ data: mockStalls })
      .mockResolvedValueOnce({ data: mockWalkinInterviews });

    render(<LiveQueueDisplay />);

    await waitFor(() => {
      expect(screen.getByText('Select Company')).toBeInTheDocument();
    });

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);

    const masOption = await screen.findByText('MAS Holdings');
    fireEvent.click(masOption);

    await waitFor(() => {
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('Pre-listed')).toBeInTheDocument();
      expect(screen.getByText('Walk-in')).toBeInTheDocument();
    });
  });

  it('displays statistics cards correctly', async () => {
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockCompanies })
      .mockResolvedValueOnce({ data: mockPrelistedInterviews })
      .mockResolvedValueOnce({ data: mockStalls })
      .mockResolvedValueOnce({ data: mockWalkinInterviews });

    render(<LiveQueueDisplay />);

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);

    const masOption = await screen.findByText('MAS Holdings');
    fireEvent.click(masOption);

    await waitFor(() => {
      // Total: 1 prelisted + 1 walkin = 2
      const stats = screen.getAllByText('2');
      expect(stats.length).toBeGreaterThan(0);
    });
  });

  it('displays prelisted interviews with student information', async () => {
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockCompanies })
      .mockResolvedValueOnce({ data: mockPrelistedInterviews })
      .mockResolvedValueOnce({ data: mockStalls })
      .mockResolvedValueOnce({ data: [] });

    render(<LiveQueueDisplay />);

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);

    const masOption = await screen.findByText('MAS Holdings');
    fireEvent.click(masOption);

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText(/REG2021001.*Group A.*level 3/)).toBeInTheDocument();
    });
  });

  it('switches between prelisted and walkin tabs', async () => {
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockCompanies })
      .mockResolvedValueOnce({ data: mockPrelistedInterviews })
      .mockResolvedValueOnce({ data: mockStalls })
      .mockResolvedValueOnce({ data: mockWalkinInterviews });

    render(<LiveQueueDisplay />);

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);

    const masOption = await screen.findByText('MAS Holdings');
    fireEvent.click(masOption);

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    const walkinTab = screen.getByRole('tab', { name: /walk-in/i });
    fireEvent.click(walkinTab);

    await waitFor(() => {
      expect(screen.getByText('Bob Williams')).toBeInTheDocument();
    });
  });

  it('displays correct status badges', async () => {
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockCompanies })
      .mockResolvedValueOnce({ data: mockPrelistedInterviews })
      .mockResolvedValueOnce({ data: mockStalls })
      .mockResolvedValueOnce({ data: [] });

    render(<LiveQueueDisplay />);

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);

    const masOption = await screen.findByText('MAS Holdings');
    fireEvent.click(masOption);

    await waitFor(() => {
      expect(screen.getByText('in-queue')).toBeInTheDocument();
    });
  });

  it('refreshes data when refresh button is clicked', async () => {
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockCompanies })
      .mockResolvedValueOnce({ data: mockPrelistedInterviews })
      .mockResolvedValueOnce({ data: mockStalls })
      .mockResolvedValueOnce({ data: mockWalkinInterviews });

    render(<LiveQueueDisplay />);

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);

    const masOption = await screen.findByText('MAS Holdings');
    fireEvent.click(masOption);

    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument();
    });

    // Clear previous mocks and set up new ones for refresh
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockPrelistedInterviews })
      .mockResolvedValueOnce({ data: mockStalls })
      .mockResolvedValueOnce({ data: mockWalkinInterviews });

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/interview/company/1/prelisted');
    });
  });

  it('displays last updated time', async () => {
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockCompanies })
      .mockResolvedValueOnce({ data: mockPrelistedInterviews })
      .mockResolvedValueOnce({ data: mockStalls })
      .mockResolvedValueOnce({ data: mockWalkinInterviews });

    render(<LiveQueueDisplay />);

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);

    const masOption = await screen.findByText('MAS Holdings');
    fireEvent.click(masOption);

    await waitFor(() => {
      expect(screen.getByText(/Last updated :/i)).toBeInTheDocument();
    });
  });

  it('displays message when no prelisted interviews', async () => {
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockCompanies })
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: mockStalls })
      .mockResolvedValueOnce({ data: [] });

    render(<LiveQueueDisplay />);

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);

    const masOption = await screen.findByText('MAS Holdings');
    fireEvent.click(masOption);

    await waitFor(() => {
      expect(screen.getByText('No pre-listed interviews in queue')).toBeInTheDocument();
    });
  });

  it('displays message when no walk-in interviews', async () => {
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockCompanies })
      .mockResolvedValueOnce({ data: mockPrelistedInterviews })
      .mockResolvedValueOnce({ data: mockStalls })
      .mockResolvedValueOnce({ data: [] });

    render(<LiveQueueDisplay />);

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);

    const masOption = await screen.findByText('MAS Holdings');
    fireEvent.click(masOption);

    const walkinTab = await screen.findByRole('tab', { name: /walk-in/i });
    fireEvent.click(walkinTab);

    await waitFor(() => {
      expect(screen.getByText('No walk-in interviews for this stall')).toBeInTheDocument();
    });
  });
});
