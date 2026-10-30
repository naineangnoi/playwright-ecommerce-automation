
# Test Coverage Matrix

## Project: Playwright E-Commerce Automation

### Objective
To validate critical e-commerce workflows using risk-based testing and Playwright automation.

## 1. Login Module

| Test ID | Test Scenario | Priority | Test Type | Automation Status |
|---|---|---|---|---|
| LOGIN-001 | Valid Login | Critical | Positive | Automated |
| LOGIN-002 | Invalid Credentials | High | Negative | Automated |
| LOGIN-003 | Empty Username | High | Negative | Automated |
| LOGIN-004 | Empty Password | High | Negative | Automated |
| LOGIN-005 | Locked-out User | High | Negative | Automated |
| LOGIN-006 | Logout | High | Positive | Automated |

### Risk Rationale
Authentication is a critical entry point to the application. Failures can prevent users from accessing core shopping functionality.

### Automation Reference
- `tests/login.spec.ts`


## 2. Product Module

| Test ID | Test Scenario | Priority | Test Type | Automation Status |
|---|---|---|---|---|
| PRODUCT-001 | Sort Price Low to High | High | Positive | Automated |
| PRODUCT-002 | Sort Price High to Low | High | Positive | Automated |
| PRODUCT-003 | Sort Name A to Z | Medium | Positive | Planned |
| PRODUCT-004 | Sort Name Z to A | Medium | Positive | Planned |
| PRODUCT-005 | Verify Product Details | High | Positive | Planned |
| PRODUCT-006 | Verify Product List Is Displayed | High | Positive | Planned |

### Risk Rationale
Product listing and sorting help customers find and compare products. Incorrect product information or sorting may affect customer decisions and shopping experience.

### Automation Reference
- `tests/sorting.spec.ts`


## 3. Cart Module

| Test ID | Test Scenario | Priority | Test Type | Automation Status |
|---|---|---|---|---|
| CART-001 | Add Product to Cart | Critical | Positive | Automated |
| CART-002 | Remove Product from Cart | High | Positive | Automated |
| CART-003 | Add Multiple Products to Cart | High | Positive | Automated |
| CART-004 | Verify Cart Badge Count | High | Positive | Planned |
| CART-005 | Verify Product Details in Cart | High | Positive | Planned |
| CART-006 | Verify Cart State After Navigation | Medium | Positive | Planned |
| CART-007 | Continue Shopping from Cart | Medium | Positive | Planned |
| CART-008 | Remove Product from Cart Page | High | Positive | Planned |

### Risk Rationale
The shopping cart is a critical part of the purchasing process. If customers cannot add products to the cart, they cannot proceed with their purchases.

Incorrect cart contents or quantities may result in order errors and negatively impact customer trust.

### Automation Reference
- `tests/cart.spec.ts`


## 4. Checkout Module

| Test ID | Test Scenario | Priority | Test Type | Automation Status |
|---|---|---|---|---|
| CHECKOUT-001 | Complete Checkout Successfully | Critical | Positive | Planned |
| CHECKOUT-002 | Checkout with Empty First Name | High | Negative | Planned |
| CHECKOUT-003 | Checkout with Empty Last Name | High | Negative | Planned |
| CHECKOUT-004 | Checkout with Empty Postal Code | High | Negative | Planned |
| CHECKOUT-005 | Verify Checkout Product Details | High | Positive | Planned |
| CHECKOUT-006 | Verify Checkout Subtotal | High | Positive | Planned |
| CHECKOUT-007 | Verify Tax and Total Calculation | High | Positive | Planned |
| CHECKOUT-008 | Cancel Checkout | Medium | Positive | Planned |
| CHECKOUT-009 | Verify Order Confirmation Message | Critical | Positive | Planned |
| CHECKOUT-010 | Checkout with Multiple Products | High | Positive | Planned |

### Risk Rationale
Checkout is a business-critical workflow because failures can prevent customers from completing purchases.

Incorrect order details, pricing, or total calculations may result in financial discrepancies and loss of customer trust.

### Automation Reference
- `tests/checkout.spec.ts` (Planned)


