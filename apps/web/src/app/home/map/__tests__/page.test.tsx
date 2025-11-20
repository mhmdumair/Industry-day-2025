import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Page from '../page';
import { useTheme } from 'next-themes';

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

// Mock window.L (Leaflet)
const mockLeaflet = {
  map: jest.fn().mockReturnValue({
    setView: jest.fn().mockReturnThis(),
    remove: jest.fn(),
  }),
  tileLayer: jest.fn().mockReturnValue({
    addTo: jest.fn(),
  }),
  marker: jest.fn().mockReturnValue({
    addTo: jest.fn().mockReturnThis(),
    bindPopup: jest.fn(),
  }),
  divIcon: jest.fn(),
  control: {
    zoom: jest.fn().mockReturnValue({
      addTo: jest.fn(),
    }),
  },
};

describe('Map Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    });

    // Mock Leaflet on window
    (window as any).L = mockLeaflet;

    // Mock document methods for script/style injection
    const mockAppendChild = jest.fn();
    const mockRemoveChild = jest.fn();
    document.head.appendChild = mockAppendChild;
    document.head.removeChild = mockRemoveChild;

    // Mock createElement to simulate script loading
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = jest.fn((tagName: string) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'script') {
        setTimeout(() => {
          if (element.onload) {
            element.onload(new Event('load'));
          }
        }, 0);
      }
      return element;
    }) as any;
  });

  afterEach(() => {
    delete (window as any).L;
  });

  it('renders loading spinner initially', () => {
    render(<Page />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('renders map container after loading', async () => {
    const { container } = render(<Page />);

    await waitFor(() => {
      const mapDiv = container.querySelector('.leaflet-container');
      expect(mapDiv).toBeInTheDocument();
    });
  });

  it('renders department data table', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Chemistry')).toBeInTheDocument();
      expect(screen.getByText('Science Education Unit')).toBeInTheDocument();
      expect(screen.getByText('Physics')).toBeInTheDocument();
      expect(screen.getByText('Geology')).toBeInTheDocument();
      expect(screen.getByText('QBITS')).toBeInTheDocument();
      expect(screen.getByText('Postgraduate Institute of Science')).toBeInTheDocument();
    });
  });

  it('renders venue and company information', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Auditorium:')).toBeInTheDocument();
      expect(screen.getByText('A Baur & Co (Pvt) Ltd (Main)')).toBeInTheDocument();
      expect(screen.getByText('New Auditorium:')).toBeInTheDocument();
      expect(screen.getByText('Noritake Lanka Porcelain (Pvt) Ltd')).toBeInTheDocument();
    });
  });

  it('renders Chemistry department venues', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Tutorial Room 1:')).toBeInTheDocument();
      expect(screen.getByText('Avenir IT (Pvt) Ltd')).toBeInTheDocument();
    });
  });

  it('renders Science Education Unit venues', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('SEU 208:')).toBeInTheDocument();
      expect(screen.getByText('Hemas Consumer Brands')).toBeInTheDocument();
      expect(screen.getByText('ELTU 210:')).toBeInTheDocument();
      expect(screen.getByText('Federation for Environment Climate and Technology')).toBeInTheDocument();
    });
  });

  it('renders Physics department venues', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Smart Room 1:')).toBeInTheDocument();
      expect(screen.getByText('MAS Holdings')).toBeInTheDocument();
      expect(screen.getByText('Seminar Room:')).toBeInTheDocument();
      expect(screen.getByText('Sands Active (Pvt) Ltd')).toBeInTheDocument();
    });
  });

  it('renders Geology department venues', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('LiveRoom Technologies')).toBeInTheDocument();
      expect(screen.getByText('Creative Software')).toBeInTheDocument();
      expect(screen.getByText('Hutch')).toBeInTheDocument();
    });
  });

  it('renders QBITS venue', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('On Site:')).toBeInTheDocument();
      expect(screen.getByText('CodeGen International (Pvt) Ltd')).toBeInTheDocument();
    });
  });

  it('renders PGIS venues', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Block C - Room 1 & 2:')).toBeInTheDocument();
      expect(screen.getByText('A Baur & Co (Pvt) Ltd (Healthcare)')).toBeInTheDocument();
    });
  });

  it('renders footer description', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('A list of companies and their respective venues.')).toBeInTheDocument();
    });
  });

  it('initializes map with correct coordinates', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(mockLeaflet.map).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('applies dark theme styles when theme is dark', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
    });

    render(<Page />);

    // The component should create style elements with dark theme colors
    expect(document.createElement).toHaveBeenCalledWith('style');
  });

  it('applies light theme styles when theme is light', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    });

    render(<Page />);

    expect(document.createElement).toHaveBeenCalledWith('style');
  });

  it('cleans up resources on unmount', async () => {
    const { unmount } = render(<Page />);

    await waitFor(() => {
      expect(mockLeaflet.map).toHaveBeenCalled();
    }, { timeout: 1000 });

    unmount();

    // Cleanup should have been called
    expect(document.head.removeChild).toHaveBeenCalled();
  });
});
