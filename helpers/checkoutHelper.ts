import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { expect } from '../fixtures/testfixture';

export async function navigateToCart(
    productPage: ProductPage,
    productNames : string[]) 
    {
        for (const productName of productNames){

            await productPage.addProductToCart(productName);

        }
        
        await productPage.viewCart();
    }

    export function extractAmount(text: string): string {
    const match = text.match(/\$\s*(\d+\.\d{2})/);

    if (!match) {
        throw new Error(`Cannot extract amount from: ${text}`);
    }

    return match[1];
}

export function extractOrderDate(pdfText: string): string {
    const match = pdfText.match(
        /Order Date\s+([A-Za-z]+ \d{1,2}, \d{4})/
    );

    if (!match) {
        throw new Error('Order Date not found in PDF');
    }

    return match[1];
}