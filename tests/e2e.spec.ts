import { test, expect } from '../fixtures/testfixture';  
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import * as fs from 'node:fs/promises';
import { extractPdfText , expectPdfAmount, extractOrderDate } from '../helpers/pdfHelper';
import { extractAmount } from '../helpers/checkoutHelper';

test(' E2E-001: Should complete checkout and download PDF order', async ({ page, productPage, checkoutCompletePage }) => {

    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);

    const products = ['Sauce Labs Backpack', 
        'Sauce Labs Bike Light', 
        'Sauce Labs Bolt T-Shirt'];

    for (const product of products) {
        await productPage.addProductToCart(product);
    }
    
    await expect(productPage.cartBadge).toHaveText('3');
    await productPage.viewCart();
    await expect(page).toHaveURL(/cart.html/);
    await expect(cartPage.productName).toHaveCount(3);
    await expect(cartPage.productName).toHaveText(products)  

    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await checkoutPage.fillCheckoutInformation('John', 'Smith', '8011');

    await expect(page).toHaveURL(/checkout-step-two\.html/);

    const orderSummary = await checkoutOverviewPage.getOrderSummary();

    console.log('Checkout Overview:', orderSummary);

    await checkoutOverviewPage.finishCheckout();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutCompletePage.confirmationMessage).toBeVisible();
    await expect(checkoutCompletePage.confirmationMessage).toHaveText('Thank you for your order!');

    const download = await checkoutCompletePage.generatePdfOrder();

    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
    expect(await download.failure()).toBeNull();

    const filePath = await download.path();
    const pdfBuffer = await fs.readFile(filePath);

    expect(pdfBuffer.length).toBeGreaterThan(0);
    expect(pdfBuffer.subarray(0, 5).toString()).toBe('%PDF-');

    const pdfText = await extractPdfText(filePath);
    expect(pdfText).toContain('Order Receipt');
    expect(pdfText).toContain('Thank you for your order!');

    for (const product of products) {
        expect(pdfText).toContain(product);
    }

    const subTotal = extractAmount(orderSummary.subtotal);
    const tax = extractAmount(orderSummary.tax);
    const total = extractAmount(orderSummary.total);
    
    expectPdfAmount(pdfText, 'Item total', subTotal);
    expectPdfAmount(pdfText, 'Tax', tax);
    expectPdfAmount(pdfText, 'Total', total);
    

    const subTotalAmount = Number(subTotal);
    const taxAmount = Number(tax);
    const totalAmount = Number(total);

    const subtotalCents = Math.round(subTotalAmount * 100);
    const taxCents = Math.round(taxAmount * 100);
    const totalCents = Math.round(totalAmount * 100);

    expect(subtotalCents + taxCents).toBe(totalCents);


    const orderDate = extractOrderDate(pdfText);

const timeZones = ['UTC', 'Pacific/Auckland'];

const validDates = timeZones.map(timeZone =>
    new Date().toLocaleDateString('en-US', {
        timeZone,
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
);

expect(validDates).toContain(orderDate);

});