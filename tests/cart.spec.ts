import {test, expect} from '../fixtures/testfixture';
import { CartPage } from '../pages/CartPage';

test('CART-001: Should add backpack to cart successfully', async ({productPage}) => {

    await productPage.addProductToCart('Sauce Labs Backpack');
    await expect(productPage.cartBadge).toHaveText('1');
});

test('CART-002: Should Remove Backpack from Cart', async ({productPage}) => {
    await productPage.addProductToCart('Sauce Labs Backpack');
    await expect(productPage.cartBadge).toHaveText('1');
    await productPage.removeBackpackFromCart();
    await expect(productPage.cartBadge).toBeHidden();
    await expect(productPage.addBackpackButton).toBeVisible();
    await expect(productPage.addBackpackButton).toHaveText('Add to cart');
});

test('CART-003:Should view cart successfully', async ({page,productPage}) => {
    
    const cartPage = new CartPage(page);

    await productPage.addProductToCart('Sauce Labs Backpack');
    await expect(productPage.cartBadge).toHaveText('1');
    await productPage.viewCart();
    await expect(page).toHaveURL(/cart.html/);
    await expect(cartPage.productName).toBeVisible();
    await expect(cartPage.productName).toHaveText('Sauce Labs Backpack');
});

test('CART-004: Should add multiple products to cart successfully', async ({page, productPage}) => {

    const cartPage = new CartPage(page);
    await productPage.addProductToCart('Sauce Labs Backpack');
    await expect(productPage.cartBadge).toHaveText('1')

    await productPage.addProductToCart('Sauce Labs Bike Light');
    await expect(productPage.cartBadge).toHaveText('2');

    await productPage.addProductToCart('Sauce Labs Bolt T-Shirt');
    await expect(productPage.cartBadge).toHaveText('3');

    await productPage.viewCart();
    await expect(productPage.page).toHaveURL(/cart.html/);
    await expect(cartPage.productName).toHaveCount(3);
    await expect(cartPage.productName).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt']);
    
});
test('CART-005: Should continue shopping from cart page', async ({page, productPage}) => {

    const cartPage = new CartPage(page);
    await productPage.addProductToCart('Sauce Labs Backpack');
    await expect(productPage.cartBadge).toHaveText('1');

    await productPage.viewCart();
    await expect(productPage.page).toHaveURL(/cart.html/);

    await cartPage.continueShopping();
    await expect(productPage.page).toHaveURL(/inventory.html/);

    await productPage.viewCart();
    await expect(productPage.page).toHaveURL(/cart.html/);

    await expect(cartPage.productName).toHaveText('Sauce Labs Backpack');
});

test('CART-006: Remove Product from Cart', async ({page, productPage}) => {

    const cartPage = new CartPage(page);

    await productPage.addProductToCart('Sauce Labs Backpack');
    await expect(productPage.cartBadge).toHaveText('1');

    await productPage.viewCart();
    await expect(productPage.page).toHaveURL(/cart.html/);
    await expect(cartPage.productName).toHaveCount(1);
    await cartPage.removeProduct();
    await expect(cartPage.productName).toHaveCount(0);

    await expect(productPage.cartBadge).toBeHidden();
});