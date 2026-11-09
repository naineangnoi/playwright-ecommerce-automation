import { testUsers } from '../data/testUsers';
import { test , expect } from '../fixtures/testFixture';
import { ProductPage } from '../pages/ProductPage';

const expectedProducts = {
    'Sauce Labs Backpack': 29.99,
    'Sauce Labs Bike Light': 9.99,
    'Sauce Labs Bolt T-Shirt': 15.99,
    'Sauce Labs Fleece Jacket': 49.99,
    'Sauce Labs Onesie': 7.99,
    'Test.allTheThings() T-Shirt (Red)': 15.99
};

test('VIS-001: Verify Inventory Page baseline', async ({  page,loginPage }) => {

    await loginPage.login(testUsers.standardUser.username, testUsers.standardUser.password);

    const productPage = new ProductPage(page);
    await expect(page).toHaveURL(/inventory.html/);
    await expect(productPage.backpackProductName).toBeVisible();

    await expect(page).toHaveScreenshot('inventory-page-baseline.png', { animations: 'disabled' , mask: [productPage.productPrices]});
});

test('VIS-002: Detect visual defect in Inventory Page @known-defect', async ({ page, loginPage }) => {
    await loginPage.login(testUsers.visualUser.username, testUsers.visualUser.password);

    const productPage = new ProductPage(page);
    await expect(page).toHaveURL(/inventory.html/);
    await expect(productPage.backpackProductName).toBeVisible();

    await expect(page).toHaveScreenshot('inventory-page-defect.png', { animations: 'disabled' ,    mask: [productPage.productPrices]});
});

test('VIS-003: Verify Product Prices', async ({ page, loginPage }) => {

    await loginPage.login(testUsers.visualUser.username, testUsers.visualUser.password);

    const productPage = new ProductPage(page);
    await expect(page).toHaveURL(/inventory.html/);

    const backpackPrice = await productPage.getProductPriceByName('Sauce Labs Backpack');

    expect(Number.isFinite(backpackPrice)).toBe(true);
    expect(backpackPrice).toBeGreaterThan(0);
});

test('VIS-004: Verify all Product Prices @known-defect', async ({ page, loginPage }) => {

    await loginPage.login(testUsers.visualUser.username, testUsers.visualUser.password);

    const productPage = new ProductPage(page);
    await expect(page).toHaveURL(/inventory.html/);

    for (const [productName, expectedPrice] of Object.entries(expectedProducts)) {
        const actualPrice = await productPage.getProductPriceByName(productName);

        expect.soft(actualPrice, `Incorrect price for ${productName}`).toEqual(expectedPrice);
    }
});