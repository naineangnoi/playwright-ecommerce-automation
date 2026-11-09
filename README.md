# Playwright E-Commerce Automation Framework

[![Playwright Tests](https://github.com/naineangnoi/playwright-ecommerce-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/naineangnoi/playwright-ecommerce-automation/actions/workflows/playwright.yml)

A test automation portfolio project built with **Playwright and TypeScript**, demonstrating UI automation, REST API testing, reusable test architecture, data validation, visual regression testing, and CI/CD integration.

The framework focuses on maintainability, test reliability, risk-based coverage, and clear separation of responsibilities.

## Tech Stack

- **Language:** TypeScript
- **Test Framework:** Playwright Test
- **Design Patterns:** Page Object Model (POM), Custom Fixtures
- **API Testing:** Playwright APIRequestContext, REST APIs
- **Test Data:** TypeScript interfaces and reusable data factories
- **Validation:** UI assertions, API response validation, PDF content validation
- **Visual Testing:** Playwright screenshot comparisons
- **CI/CD:** GitHub Actions
- **Version Control:** Git and GitHub

## Test Coverage

### UI Automation — SauceDemo

Automated end-to-end testing of the [SauceDemo](https://www.saucedemo.com/) application.

Coverage includes:

- Successful and unsuccessful login scenarios
- Required-field validation and locked-out users
- Logout functionality
- Adding and removing products from the shopping cart
- Product sorting by price
- Checkout workflow validation
- PDF order receipt validation
- Visual regression testing

The UI framework uses the **Page Object Model** to separate page interactions from test assertions and improve maintainability.

### REST API Automation — GoREST

Automated API testing against the [GoREST](https://gorest.co.in/) public REST API.

| Test ID | Scenario | Method |
|---|---|---|
| API-001 | Retrieve users and validate response structure | GET |
| API-002 | Create a user and retrieve it by ID | POST, GET |
| API-003 | Verify 404 response for a nonexistent user | GET |
| API-004 | Create a user and validate response data | POST |
| API-005 | Verify persistence of newly created user data | POST, GET |
| API-006 | Update user status and verify persisted changes | POST, PATCH, GET |
| API-007 | Delete a user and verify it is no longer accessible | POST, DELETE, GET |

**API testing practices:**

- HTTP status code validation
- Response body and data integrity assertions
- Positive and negative test scenarios
- CRUD workflow validation
- Independent test data generation
- Cleanup using `try...finally`
- Reusable API client methods
- Environment-based authentication
- Custom Playwright API fixtures

## Framework Architecture
### UI Custom Fixture

`fixtures/testFixture.ts` provides reusable page objects and shared UI test setup, reducing duplicated initialization code across UI test scenarios.

### Page Object Model

Page objects encapsulate UI locators and reusable page interactions, keeping tests focused on business scenarios and expected results.

### Reusable API Client

`api/UserApi.ts` encapsulates GoREST API operations:

- `getUsers()`
- `getUser()`
- `createUser()`
- `updateUser()`
- `deleteUser()`

This reduces duplication of HTTP request logic, endpoint URLs, and authentication configuration.

### Custom API Fixture

`fixtures/apiFixture.ts` extends Playwright's built-in `test` fixture to provide an initialized `userApi` instance.

```typescript
test('API-001: Get existing user', async ({ userApi }) => {
  const response = await userApi.getUsers();

  expect(response.status()).toBe(200);
});
```

The fixture centralizes API client initialization and token validation, allowing tests to focus on behavior and assertions.

### Test Data Factory

`data/userFactory.ts` generates unique user data for API tests.

```typescript
const newUser = createTestUser();
```

This reduces hardcoded test data and helps prevent conflicts between test executions.

### TypeScript Data Models

`types/User.ts` defines the user data structure, supporting type safety and consistent API client contracts.

## Project Structure

Key framework components:

```text
playwright-ecommerce-automation/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── api/
│   └── UserApi.ts
├── data/
│   ├── invalidLoginData.ts
│   ├── testUsers.ts
│   └── userFactory.ts
├── fixtures/
│   ├── apiFixture.ts
│   └── testFixture.ts
├── helpers/
│   ├── checkoutHelper.ts
│   └── pdfHelper.ts
├── pages/
│   ├── CartPage.ts
│   ├── CheckoutCompletePage.ts
│   ├── CheckoutOverviewPage.ts
│   ├── CheckoutPage.ts
│   ├── LoginPage.ts
│   └── ProductPage.ts
├── tests/
│   ├── api/
│   │   └── users.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   ├── e2e.spec.ts
│   ├── login.spec.ts
│   ├── sorting.spec.ts
│   └── visual.spec.ts
├── types/
│   └── User.ts
├── .gitignore
├── package.json
├── playwright.config.ts
└── README.md
```

The repository also contains UI test fixtures, page objects, and supporting utilities for end-to-end testing.

## Getting Started

### Prerequisites

- Node.js
- npm
- Git
- A GoREST API access token for authenticated API operations

### Installation

Clone the repository:

```bash
git clone https://github.com/naineangnoi/playwright-ecommerce-automation.git
cd playwright-ecommerce-automation
```

Install dependencies:

```bash
npm ci
```

Install Playwright browsers:

```bash
npx playwright install
```

### API Authentication

Create a `.env` file in the project root:

```env
GOREST_TOKEN=your_gorest_api_token
```

The API fixture reads the token from the environment and uses it to initialize the API client.

**Security:** The `.env` file is excluded from version control. API credentials must not be committed to GitHub.

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run API tests:

```bash
npx playwright test tests/api/users.spec.ts
```

Run a specific API scenario:

```bash
npx playwright test tests/api/users.spec.ts --grep "API-006"
```

Run TypeScript validation:

```bash
npx tsc --noEmit
```

View the Playwright HTML report:

```bash
npx playwright show-report
```

## CI/CD — GitHub Actions

The project uses GitHub Actions to execute automated tests in CI.

The workflow:

- Installs project dependencies and Playwright browsers
- Executes the configured regression test suite
- Excludes tests tagged `@known-defect` from the standard regression run
- Runs API tests using a securely configured `GOREST_TOKEN` repository secret
- Uploads the Playwright HTML report as a workflow artifact

This provides automated feedback on test execution and helps identify regressions after code changes.

## Test Strategy and Quality Practices

The framework demonstrates several software quality engineering practices.

**Risk-based testing:** Prioritizing critical user journeys such as authentication, cart operations, checkout, and API data integrity.

**Positive and negative testing:** Validating both successful operations and expected error handling.

**Test independence:** Generating unique API test data to minimize dependencies between scenarios.

**Test data cleanup:** Using `try...finally` to remove created records even when assertions fail.

**Maintainability:** Separating page objects, API clients, fixtures, test data, and assertions.

**Known defect management:** Using the `@known-defect` tag to distinguish documented application defects from the standard passing regression suite.

**Visual regression:** Using screenshot comparisons to detect unintended UI changes.

**CI/CD integration:** Executing automated regression checks through GitHub Actions.

## Future Improvements

Planned enhancements include:

- API response schema validation
- Additional negative API test scenarios
- Data-driven API testing
- Expanded cross-browser coverage
- Improved test reporting and diagnostics
- Additional end-to-end business workflows

## Project Purpose

This repository is a hands-on automation engineering project demonstrating practical application of Playwright, TypeScript, reusable framework design, UI and REST API testing, and CI/CD practices.

It reflects an ongoing focus on building reliable, scalable, and maintainable test automation solutions.