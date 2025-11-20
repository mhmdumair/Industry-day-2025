# Testing Guide

## Overview

This project uses Jest and React Testing Library for unit testing Next.js frontend components.

## Test Files Created

1. **`src/app/__tests__/page.test.tsx`** - Landing page tests
2. **`src/app/home/__tests__/page.test.tsx`** - Home/Sponsors page tests
3. **`src/app/home/map/__tests__/page.test.tsx`** - Map page tests
4. **`src/app/home/live/__tests__/page.test.tsx`** - Live queue display tests

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run specific test file
```bash
npm test -- page.test.tsx
```

### Run tests for a specific page
```bash
npm test -- home/page.test.tsx
```

## Test Structure

Each test file follows this structure:

### 1. Landing Page Tests (`page.test.tsx`)
- Renders page title and branding
- Tests navigation buttons (Login, Student Registration, Company Registration)
- Verifies alert messages
- Checks skeleton loading elements

### 2. Home/Sponsors Page Tests (`home/page.test.tsx`)
- Tests API data fetching
- Verifies sponsor categorization (MAIN, SILVER, BRONZE)
- Tests loading and error states
- Validates Cloudinary image URLs
- Tests fallback images on error

### 3. Map Page Tests (`map/page.test.tsx`)
- Tests Leaflet map initialization
- Verifies department data rendering
- Tests venue and company information display
- Validates theme switching (light/dark)
- Tests resource cleanup on unmount

### 4. Live Queue Display Tests (`live/page.test.tsx`)
- Tests company selection dropdown
- Validates queue data fetching
- Tests prelisted and walk-in interview displays
- Verifies status badges
- Tests refresh functionality
- Validates tab switching between prelisted and walk-in

## Mocking

### Global Mocks (in `jest.setup.ts`)
- `next/navigation` - Router, search params, pathname
- `next-themes` - Theme provider and useTheme hook
- `axios` - API calls
- `window.matchMedia` - Media queries

### Component-Specific Mocks
Each test file contains specific mocks for:
- Child components
- API responses
- External libraries (e.g., Leaflet for maps)

## Coverage

Code coverage reports are generated in the `coverage/` directory when running tests with the `--coverage` flag.

To view coverage in your browser:
```bash
npm test -- --coverage
open coverage/lcov-report/index.html
```

## Best Practices

1. **Test user interactions**: Focus on testing what users see and do
2. **Mock external dependencies**: API calls, third-party libraries, etc.
3. **Test error states**: Network failures, empty data, etc.
4. **Use semantic queries**: Prefer `getByRole`, `getByText` over `getByTestId`
5. **Wait for async operations**: Use `waitFor` for data fetching

## Troubleshooting

### Tests failing due to missing mocks
- Check `jest.setup.ts` for global mocks
- Add component-specific mocks in test files

### TypeScript errors
- Ensure all types are properly imported
- Use `jest.Mock` for mocking typed functions

### Async test timeouts
- Increase timeout in `waitFor`: `waitFor(() => {...}, { timeout: 5000 })`
- Ensure promises are properly resolved in mocks

## Adding New Tests

1. Create a `__tests__` folder in the same directory as the component
2. Name the test file `[component-name].test.tsx`
3. Follow the existing test structure
4. Mock external dependencies
5. Test user interactions and edge cases
