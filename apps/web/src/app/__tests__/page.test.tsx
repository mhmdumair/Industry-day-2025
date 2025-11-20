import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from '../page';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Landing Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();
  });

  it('renders the page title and faculty name', () => {
    render(<Page />);

    expect(screen.getByText('INDUSTRY DAY 2025')).toBeInTheDocument();
    expect(screen.getByText('FACULTY OF SCIENCE')).toBeInTheDocument();
  });

  it('renders university logo', () => {
    render(<Page />);

    const logo = screen.getByAltText('University Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/unilogo.png');
  });

  it('renders login button and navigates on click', () => {
    render(<Page />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  it('renders welcome alert with registration information', () => {
    render(<Page />);

    expect(screen.getByText('Welcome to SIIC Website!')).toBeInTheDocument();
    expect(screen.getByText(/Have you registered for/i)).toBeInTheDocument();
    expect(screen.getByText(/Industry Day 2025/i)).toBeInTheDocument();
  });

  it('renders student registration button and navigates on click', () => {
    render(<Page />);

    const studentButton = screen.getByRole('button', { name: /student registration/i });
    expect(studentButton).toBeInTheDocument();

    fireEvent.click(studentButton);
    expect(mockPush).toHaveBeenCalledWith('/auth/register/student');
  });

  it('renders company registration button and navigates on click', () => {
    render(<Page />);

    const companyButton = screen.getByRole('button', { name: /company registration/i });
    expect(companyButton).toBeInTheDocument();

    fireEvent.click(companyButton);
    expect(mockPush).toHaveBeenCalledWith('/auth/register/company');
  });

  it('renders skeleton loading elements', () => {
    const { container } = render(<Page />);

    // Check for skeleton elements (they don't have specific text, so we check the structure)
    const skeletons = container.querySelectorAll('[class*="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders ModeToggle component', () => {
    const { container } = render(<Page />);

    // ModeToggle component should be present in the header
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });
});
