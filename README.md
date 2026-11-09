
# Playwright E-Commerce Test Automation Framework

[![Playwright Tests](https://github.com/naineangnoi/playwright-ecommerce-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/naineangnoi/playwright-ecommerce-automation/actions/workflows/playwright.yml)

An end-to-end test automation project built with **Playwright and TypeScript**, using the [SauceDemo](https://www.saucedemo.com/) e-commerce application.

This project demonstrates practical software quality engineering skills, including test framework design, functional testing, end-to-end workflows, PDF validation, visual regression testing, and CI/CD integration.

## Tech Stack

| Technology | Purpose |
|---|---|
| Playwright | Browser automation and end-to-end testing |
| TypeScript | Test development |
| Node.js | JavaScript runtime |
| Page Object Model (POM) | Maintainable and reusable page interactions |
| Custom Fixtures | Reusable test setup and page objects |
| GitHub Actions | Continuous integration |
| Git | Version control |
| PDF Parsing | Order receipt content validation |

## Test Coverage

### 1. Login and Authentication

- Successful login with valid credentials
- Invalid username and password
- Empty username and password validation
- Locked-out user validation
- Logout functionality
- Login behaviour for special users, including `performance_glitch_user`, `problem_user`, `error_user`, and `visual_user`

### 2. Product Inventory

- Verify product inventory page
- Add products to the shopping cart
- Remove products from the cart
- Verify cart badge updates
- Sort products by price (low to high and high to low)
- Validate product price data

### 3. Shopping Cart and Checkout

- Add multiple products to the cart
- Verify product names and quantities
- Complete checkout information
- Validate checkout order summary
- Complete the purchase workflow
- Verify order confirmation

### 4. PDF Order Receipt Validation

Automated validation of the downloadable PDF receipt after checkout.

Validation includes:

- Successful PDF download
- PDF file format and non-empty content
- Order receipt text
- Purchased product names
- Subtotal, tax, and total amounts
- Arithmetic consistency between subtotal, tax, and total
- Order date validation

The PDF tests use reusable helper functions for extracting and validating receipt information.

### 5. Visual Regression Testing

Visual regression tests compare screenshots against approved baseline images to detect unintended UI changes.

Features include:

- Screenshot comparison using Playwright
- Separate baselines for supported execution environments
- Masking dynamic product prices
- Detection of unexpected product image and layout changes
- Screenshot comparison reports for investigating visual differences

**Example:** Visual testing identified an unexpected product image displayed for the Sauce Labs Backpack when using `visual_user`.

### 6. Known Defect Management

Tests associated with known defects are tagged with `@known-defect`.

The standard regression pipeline excludes these tests to prevent existing, documented issues from blocking unrelated validation.

Run known defect tests separately:

```bash
npx playwright test --grep "@known-defect"
```

Run standard regression tests:

```bash
npx playwright test --grep-invert "@known-defect"
```

Known defects should be reviewed and reintroduced into the regular regression suite once resolved.

## Framework Design

The framework follows the **Page Object Model (POM)** design pattern to separate test scenarios from page interactions and locators.

Key design principles:

- Reusable page objects
- Centralised locators
- Custom Playwright fixtures
- Separation of test data and test logic
- Reusable helper functions
- Playwright auto-waiting and web-first assertions
- Clear test naming and scenario identification

### Project Structure

The following illustrates the main framework components:

```text
playwright-ecommerce-automation/
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── data/
│   ├── testUsers.ts
│   └── invalidLoginData.ts
│
├── fixtures/
│   └── testfixture.ts
│
├── helpers/
│   ├── checkoutHelper.ts
│   └── pdfHelper.ts
│
├── pages/
│   ├── LoginPage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── CheckoutOverviewPage.ts
│
├── tests/
│   ├── login.spec.ts
│   ├── e2e.spec.ts
│   ├── visual.spec.ts
│   └── visual.spec.ts-snapshots/
│
├── playwright.config.ts
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

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

### Run Tests

Run all tests:

```bash
npx playwright test
```

Run regression tests excluding known defects:

```bash
npx playwright test --grep-invert "@known-defect"
```

Run a specific test file:

```bash
npx playwright test tests/login.spec.ts
```

Run tests with a visible browser:

```bash
npx playwright test --headed
```

Run tests using the Playwright UI:

```bash
npx playwright test --ui
```

View the HTML report:

```bash
npx playwright show-report
```

## CI/CD Integration

The project uses **GitHub Actions** to automatically execute Playwright regression tests.

The CI workflow includes:

1. Checkout repository source code
2. Set up Node.js
3. Install project dependencies
4. Install Playwright browsers and required system dependencies
5. Execute regression tests
6. Upload the Playwright HTML report as a build artifact

The regression pipeline excludes tests tagged with `@known-defect`.

### Visual Testing in CI

Screenshot baselines are maintained for the relevant operating systems.

Linux baseline screenshots are committed to the repository so GitHub Actions can compare actual screenshots against approved expected results.

Snapshot updates are not performed automatically during normal regression execution.

## Test Execution & Evidence

The framework provides test reports and visual evidence to support defect investigation and regression analysis.

### CI/CD Execution

[View GitHub Actions Test Runs](https://github.com/naineangnoi/playwright-ecommerce-automation/actions)

### Visual Regression Example

A visual comparison between `standard_user` and `visual_user` identified an unexpected product image on the inventory page.

- **Expected:** Correct Sauce Labs Backpack product image
- **Actual:** An incorrect dog image displayed instead of the backpack
- **Detection:** Playwright screenshot comparison
- **Dynamic content:** Product prices masked to reduce false positives

Expected, actual, and difference screenshots can be used as evidence when investigating UI defects.

### Test Reports

Playwright HTML reports provide:

- Test execution results
- Failure details
- Screenshots and visual differences
- Debugging information

Reports are uploaded as GitHub Actions artifacts and can be reviewed after CI execution.

## Testing Approach

This project applies several practical QA techniques.

### Risk-Based Testing

Focuses on critical user journeys such as authentication, shopping cart operations, checkout completion, and order summary calculations.

### Data-Driven Testing

Uses reusable test data to validate multiple authentication scenarios.

### Boundary and Negative Testing

Covers missing credentials, invalid inputs, and restricted user access.

### End-to-End Testing

Validates the customer journey from product selection through checkout and receipt generation.

### Visual Regression Testing

Identifies unexpected changes to the user interface through screenshot comparison.

## Future Improvements

### API Test Automation (Planned)

Extend the existing Playwright TypeScript framework with API testing using Playwright's built-in `APIRequestContext`.

Planned coverage:

- GET, POST, PUT/PATCH, and DELETE requests
- HTTP status code and response body validation
- JSON schema validation
- Positive and negative API test scenarios
- Authentication and error handling
- API and UI integration testing
- API regression execution in GitHub Actions

### Additional Enhancements

- Cross-browser regression testing
- Expanded negative checkout scenarios
- Improved test reporting and diagnostics
- Additional CI/CD execution strategies

## Project Purpose

This project was developed as a hands-on automation portfolio to demonstrate practical experience in designing, implementing, maintaining, and integrating automated software tests.

The focus is on building a maintainable, scalable, and reliable test automation framework that supports continuous quality improvement.

---

**Built with Playwright, TypeScript, and a quality engineering mindset.**
