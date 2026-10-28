import {test, expect} from '../fixtures/testfixture';

test('Should add backpack to cart successfully', async ({productPage}) => {

    await productPage.addBackpackToCart();
    await expect(productPage.cartBadge).toHaveText('1');
});

test('Should Remove Backpack from Cart', async ({productPage}) => {
    await productPage.addBackpackToCart();
    await expect(productPage.cartBadge).toHaveText('1');
    await productPage.removeBackpackFromCart();
    await expect(productPage.cartBadge).toBeHidden();
    await expect(productPage.addBackpackButton).toBeVisible();
    await expect(productPage.addBackpackButton).toHaveText('Add to cart');
});