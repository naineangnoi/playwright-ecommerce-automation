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
