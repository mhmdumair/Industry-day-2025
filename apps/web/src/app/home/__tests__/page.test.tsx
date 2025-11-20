import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AnnouncementsPage from '../page';
import api from '../../../lib/axios';

// Mock the axios instance
jest.mock('../../../lib/axios');

// Mock the child components
jest.mock('../../../components/home/home-announcement', () => {
  return function MockHomeAnnouncement() {
    return <div data-testid="home-announcement">Announcements</div>;
  };
});

jest.mock('../../../components/home/sponsor-dialog', () => {
  return function MockSponsorDialog({ sponsor, triggerComponent }: any) {
    return <div data-testid="sponsor-dialog">{triggerComponent}</div>;
  };
});

describe('Home Page (Announcements & Sponsors)', () => {
  const mockCompanies = [
    {
      companyID: '1',
      userID: 'user1',
      companyName: 'Main Sponsor Co',
      description: 'Main sponsor description',
      contactPersonName: 'John Doe',
      contactPersonDesignation: 'CEO',
      contactNumber: '123456789',
      logo: 'https://res.cloudinary.com/test/main-logo.png',
      stream: 'IT',
      sponsership: 'MAIN',
      location: 'Colombo',
      companyWebsite: 'https://mainsponsor.com',
      user: {
        userID: 'user1',
        email: 'main@test.com',
        role: 'company',
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: null,
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
      },
    },
    {
      companyID: '2',
      userID: 'user2',
      companyName: 'Silver Sponsor Co',
      description: 'Silver sponsor description',
      contactPersonName: 'Jane Smith',
      contactPersonDesignation: 'Manager',
      contactNumber: '987654321',
      logo: 'https://res.cloudinary.com/test/silver-logo.png',
      stream: 'IT',
      sponsership: 'SILVER',
      location: 'Galle',
      companyWebsite: 'https://silversponsor.com',
      user: {
        userID: 'user2',
        email: 'silver@test.com',
        role: 'company',
        first_name: 'Jane',
        last_name: 'Smith',
        profile_picture: null,
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
      },
    },
    {
      companyID: '3',
      userID: 'user3',
      companyName: 'Bronze Sponsor Co',
      description: 'Bronze sponsor description',
      contactPersonName: 'Bob Johnson',
      contactPersonDesignation: 'Director',
      contactNumber: '555555555',
      logo: 'https://res.cloudinary.com/test/bronze-logo.png',
      stream: 'IT',
      sponsership: 'BRONZE',
      location: 'Kandy',
      companyWebsite: 'https://bronzesponsor.com',
      user: {
        userID: 'user3',
        email: 'bronze@test.com',
        role: 'company',
        first_name: 'Bob',
        last_name: 'Johnson',
        profile_picture: null,
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading spinner initially', () => {
    (api.get as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<AnnouncementsPage />);

    expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner has role="status"
  });

  it('renders companies after successful data fetch', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockCompanies });

    render(<AnnouncementsPage />);

    await waitFor(() => {
      expect(screen.getByText('Companies')).toBeInTheDocument();
    });

    expect(screen.getByText('All the companies participating and their vacancies.')).toBeInTheDocument();
  });

  it('renders HomeAnnouncement component', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockCompanies });

    render(<AnnouncementsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('home-announcement')).toBeInTheDocument();
    });
  });

  it('displays main sponsor correctly', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockCompanies });

    render(<AnnouncementsPage />);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      const mainSponsorLogo = images.find(img => img.getAttribute('alt') === 'Main Sponsor Co logo');
      expect(mainSponsorLogo).toBeInTheDocument();
      expect(mainSponsorLogo).toHaveAttribute('src', 'https://res.cloudinary.com/test/main-logo.png');
    });
  });

  it('displays silver sponsors correctly', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockCompanies });

    render(<AnnouncementsPage />);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      const silverSponsorLogo = images.find(img => img.getAttribute('alt') === 'Silver Sponsor Co logo');
      expect(silverSponsorLogo).toBeInTheDocument();
    });
  });

  it('displays bronze sponsors correctly', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockCompanies });

    render(<AnnouncementsPage />);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      const bronzeSponsorLogo = images.find(img => img.getAttribute('alt') === 'Bronze Sponsor Co logo');
      expect(bronzeSponsorLogo).toBeInTheDocument();
    });
  });

  it('renders error message when API call fails', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<AnnouncementsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch companies data/i)).toBeInTheDocument();
    });
  });

  it('renders error message when no data is received', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: null });

    render(<AnnouncementsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Error: No companies data received/i)).toBeInTheDocument();
    });
  });

  it('transforms sponsor data correctly for SponsorDialog', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [mockCompanies[0]] });

    render(<AnnouncementsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('sponsor-dialog')).toBeInTheDocument();
    });
  });

  it('uses fallback image when logo fails to load', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockCompanies });

    render(<AnnouncementsPage />);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      const mainSponsorLogo = images.find(img => img.getAttribute('alt') === 'Main Sponsor Co logo');

      if (mainSponsorLogo) {
        // Simulate image error
        const errorEvent = new Event('error');
        mainSponsorLogo.dispatchEvent(errorEvent);
      }
    });
  });
});
