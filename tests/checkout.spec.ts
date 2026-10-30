import {test,expect} from '../fixtures/testfixture';
import { CartPage } from '../pages/CartPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { navigateToCart } from '../helpers/checkoutHelper';

const checkoutValidationData = [
    {
        id: 'CHECKOUT-002',
        field: 'First Name',
        firstName: '',
        lastName: 'Smith',
        postalCode: '8011',
        expectedError: 'Error: First Name is required'
    },
    {
        id: 'CHECKOUT-003',
        field: 'Last Name',
        firstName: 'John',
        lastName: '',
        postalCode: '8011',
        expectedError: 'Error: Last Name is required'
    },
    {
        id: 'CHECKOUT-004',
        field: 'Postal Code',
        firstName: 'John',
        lastName: 'Smith',
        postalCode: '',
        expectedError: 'Error: Postal Code is required'
    }
];

checkoutValidationData.forEach((data) => {
    test(`${data.id}: Verify ${data.field} is Required`, async ({page,productPage}) => {
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await productPage.addProductToCart('Sauce Labs Backpack');
        await expect(productPage.cartBadge).toHaveText('1');

        await productPage.viewCart();
        await expect(page).toHaveURL(/cart.html/);
        await expect(cartPage.productName).toBeVisible();
        await expect(cartPage.productName).toHaveText('Sauce Labs Backpack');

        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(/checkout-step-one.html/);

        await checkoutPage.fillCheckoutInformation(data.firstName, data.lastName, data.postalCode);
        await expect(checkoutPage.errorMessage).toBeVisible();
        await expect(checkoutPage.errorMessage).toHaveText(data.expectedError);
    });
});

test('CHECKOUT-001: Should complete checkout successfully', async ({page,productPage}) => {

    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await navigateToCart(productPage, ['Sauce Labs Backpack']);

    await expect(productPage.cartBadge).toHaveText('1');
    await expect(page).toHaveURL(/cart.html/);
    await expect(cartPage.productName).toBeVisible();
    await expect(cartPage.productName).toHaveText('Sauce Labs Backpack');

    
    await cartPage.proceedToCheckout();

    await expect(page).toHaveURL(/checkout-step-one.html/); 

    await checkoutPage.fillCheckoutInformation('John', 'Smith', '8011');
    await expect(page).toHaveURL(/checkout-step-two.html/);

    await checkoutPage.finishCheckout();
    await expect(page).toHaveURL(/checkout-complete.html/);
    await expect(checkoutPage.confirmationMessage).toBeVisible();
    await expect(checkoutPage.confirmationMessage).toHaveText('Thank you for your order!');

});

test('CHECKOUT-005: Verify Order Total', async ({page,productPage}) => {

    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);

    await productPage.addProductToCart('Sauce Labs Backpack');
    await expect(productPage.cartBadge).toHaveText('1');

    await productPage.viewCart();
    await expect(page).toHaveURL(/cart.html/);
    await expect(cartPage.productName).toBeVisible();
    await expect(cartPage.productName).toHaveText('Sauce Labs Backpack');

    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one.html/);

    await checkoutPage.fillCheckoutInformation('John', 'Smith', '8011');
    await expect(page).toHaveURL(/checkout-step-two.html/);

    const itemTotalText = await checkoutOverviewPage.itemTotal.textContent();
    const taxText = await checkoutOverviewPage.tax.textContent();
    const totalText = await checkoutOverviewPage.total.textContent();

    const itemTotal = parseFloat(itemTotalText!.replace('Item total: $', ''));
    const tax = parseFloat(taxText!.replace('Tax: $', ''));
    const total = parseFloat(totalText!.replace('Total: $', ''));

    expect(Number.isFinite(itemTotal)).toBe(true);
    expect(Number.isFinite(tax)).toBe(true);
    expect(Number.isFinite(total)).toBe(true);

    expect(total).toBeCloseTo(itemTotal + tax, 2);

});

test('CHECKOUT-006: Verify Order Summary with Multiple Products', async ({page,productPage}) => {


    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);

    await navigateToCart(productPage, ['Sauce Labs Backpack','Sauce Labs Bike Light','Sauce Labs Bolt T-Shirt', 'Sauce Labs Fleece Jacket']);
    await expect(page).toHaveURL(/cart.html/);
    await expect(cartPage.productName).toHaveCount(4);
    await expect(cartPage.productName).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt', 'Sauce Labs Fleece Jacket']);

    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one.html/);

    await checkoutPage.fillCheckoutInformation('John', 'Smith', '8011');
    await expect(page).toHaveURL(/checkout-step-two.html/);

    const itemTotalText = await checkoutOverviewPage.itemTotal.textContent();
    const taxText = await checkoutOverviewPage.tax.textContent();
    const totalText = await checkoutOverviewPage.total.textContent();

    const itemTotal = parseFloat(itemTotalText!.replace('Item total: $', ''));
    const tax = parseFloat(taxText!.replace('Tax: $', ''));
    const total = parseFloat(totalText!.replace('Total: $', ''));

    expect(Number.isFinite(itemTotal)).toBe(true);
    expect(Number.isFinite(tax)).toBe(true);
    expect(Number.isFinite(total)).toBe(true);

    expect(total).toBeCloseTo(itemTotal + tax, 2);
    await expect(checkoutOverviewPage.ProductPrice).toHaveCount(4);

    const productPrices = await checkoutOverviewPage.ProductPrice.allTextContents();
    const prices = productPrices.map(price => parseFloat(price.replace('$', '')));
    expect(prices.every(price => Number.isFinite(price) )).toBe(true);
    const calculatedItemTotal = prices.reduce((sum, price) => sum + price, 0);

    expect(calculatedItemTotal).toBeCloseTo(itemTotal, 2);
});

test('CHECKOUT-007: Cancel Checkout', async ({page,productPage}) => {   
    
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);    
    const checkoutOverviewPage = new CheckoutOverviewPage(page); 
    
    await productPage.addProductToCart('Sauce Labs Backpack');
    await expect(productPage.cartBadge).toHaveText('1');

    await productPage.viewCart();
    await expect(page).toHaveURL(/cart.html/);
    await expect(cartPage.productName).toBeVisible();
    await expect(cartPage.productName).toHaveText('Sauce Labs Backpack');

    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one.html/);

    await checkoutPage.fillCheckoutInformation('John', 'Smith', '8011');
    await expect(page).toHaveURL(/checkout-step-two.html/);

    await checkoutOverviewPage.cancelCheckout();
    await expect(page).toHaveURL(/inventory.html/);
    await expect(productPage.cartBadge).toHaveText('1');
});

test('CHECKOUT-008: Cancel Checkout from Step One', async ({page,productPage}) => {

    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await productPage.addProductToCart('Sauce Labs Backpack');
    await expect(productPage.cartBadge).toHaveText('1');

    await productPage.viewCart();
    await expect(page).toHaveURL(/cart.html/);
    await expect(cartPage.productName).toBeVisible();
    await expect(cartPage.productName).toHaveText('Sauce Labs Backpack');

    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one.html/);

    await checkoutPage.cancelCheckout();
    await expect(page).toHaveURL(/cart.html/);
    await expect(productPage.cartBadge).toHaveText('1');
    await expect(cartPage.productName).toHaveText('Sauce Labs Backpack');
});



