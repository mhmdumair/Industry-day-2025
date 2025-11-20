# Jest Testing Setup Summary

## What Was Done

### 1. Configuration Files

#### `jest.config.ts` (Root)
- Configured Jest for the Next.js project
- Set up `jsdom` test environment for React components
- Configured path aliases (`@/*` → `apps/web/src/*`)
- Added test file patterns
- Configured ts-jest transformer for TypeScript
- Set up coverage collection

#### `jest.setup.ts` (Root)
- Global test setup file
- Mocked Next.js navigation (`useRouter`, `useSearchParams`, `usePathname`)
- Mocked `next-themes` (`useTheme`, `ThemeProvider`)
- Mocked axios API client
- Mocked `window.matchMedia` for responsive design tests

#### `apps/web/tsconfig.json`
- Added Jest and Testing Library types to TypeScript configuration
- Types added: `jest`, `@testing-library/jest-dom`

### 2. Test Files Created

#### **apps/web/src/app/__tests__/page.test.tsx**
Landing page unit tests covering:
- Page title and branding rendering
- University logo display
- Login button functionality
- Student registration button
- Company registration button
- Welcome alert message
- Skeleton loading elements

#### **apps/web/src/app/home/__tests__/page.test.tsx**
Home/Sponsors page unit tests covering:
- Loading spinner display
- Company data fetching from API
- Main sponsor display with Cloudinary images
- Silver sponsors grid display
- Bronze sponsors grid display
- Error handling (API failures, no data)
- Fallback images on load error
- HomeAnnouncement component rendering
- Sponsor data transformation

#### **apps/web/src/app/home/map/__tests__/page.test.tsx**
Map page unit tests covering:
- Loading spinner
- Leaflet map initialization
- Department markers on map
- Department data table rendering
- Venue and company information display
- All 6 departments (Chemistry, SEU, Physics, Geology, QBITS, PGIS)
- Theme switching (light/dark mode)
- Resource cleanup on unmount

#### **apps/web/src/app/home/live/__tests__/page.test.tsx**
Live queue display unit tests covering:
- Page title and description
- Company dropdown loading and selection
- Queue data fetching (prelisted + walk-in)
- Statistics cards (Total, Pre-listed, Walk-in)
- Prelisted interviews tab with student info
- Walk-in interviews tab with stall selection
- Status badges (in-queue, in-progress, completed, cancelled)
- Refresh functionality
- Last updated timestamp
- Empty state messages
- Error handling

### 3. Documentation

#### **apps/web/TESTING.md**
Comprehensive testing guide including:
- How to run tests
- Test structure explanation
- Mocking strategies
- Coverage reports
- Best practices
- Troubleshooting tips
- How to add new tests

## Dependencies Installed

Already present in `package.json`:
- `jest@^30.2.0`
- `@types/jest@^30.0.0`
- `jest-environment-jsdom@^30.2.0`
- `@testing-library/react@^16.3.0`
- `@testing-library/jest-dom@^6.9.1`
- `@testing-library/dom@^10.4.1`

Additionally installed:
- `ts-jest` - TypeScript preprocessor for Jest

## Running the Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- page.test.tsx

# Run in watch mode
npm test -- --watch
```

## Test Coverage

The tests cover:
- **4 page components**
- **User interactions** (button clicks, form submissions, tab switching)
- **API calls and data fetching**
- **Loading states**
- **Error states**
- **Conditional rendering**
- **Theme switching**
- **Image fallbacks**
- **Map initialization**
- **Dynamic data display**

## Key Features

1. **Comprehensive Mocking**
   - Next.js router and navigation
   - API calls
   - Theme provider
   - External libraries (Leaflet)

2. **Realistic Test Scenarios**
   - API success and failure cases
   - Empty data scenarios
   - User interactions
   - Async data loading

3. **Type Safety**
   - All tests written in TypeScript
   - Proper type definitions for mocks
   - IDE support for test writing

4. **Best Practices**
   - Testing Library principles (user-centric testing)
   - Proper async handling with `waitFor`
   - Clean test organization
   - Descriptive test names

## Next Steps

To expand testing coverage:
1. Add tests for other pages (student, company, admin dashboards)
2. Add integration tests for multi-page flows
3. Add E2E tests with Playwright or Cypress
4. Set up CI/CD pipeline to run tests automatically
5. Add visual regression testing with Percy or Chromatic
6. Increase coverage threshold in Jest config
7. Add mutation testing with Stryker

## Troubleshooting

If tests fail:
1. Check that all dependencies are installed: `npm install`
2. Verify TypeScript types are configured in `tsconfig.json`
3. Check that mocks in `jest.setup.ts` match your component usage
4. Look for async issues - ensure `waitFor` is used properly
5. Check console output for specific error messages
