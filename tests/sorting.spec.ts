import {test,expect} from '../fixtures/testfixture';
import {LoginPage} from '../pages/LoginPage';       
import {ProductPage} from '../pages/ProductPage';


test('Should sort products by price from low to high', async ({productPage}) => {
 
    await productPage.priceSortDropdown.selectOption('lohi');

    const prices = await productPage.productPrices.allTextContents();
    console.log(prices);

    const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
    console.log(numericPrices);

    const expectedPrices = [...numericPrices].sort((a, b) => a - b);
    console.log(expectedPrices);
    await expect(numericPrices).toEqual(expectedPrices);
});

test('Should sort products by price from high to low', async ({productPage}) => {

    await productPage.priceSortDropdown.selectOption('hilo');

    const prices = await productPage.productPrices.allTextContents();
    console.log(prices);

    const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
    console.log(numericPrices);

    const expectedPrices = [...numericPrices].sort((a, b) => b - a);
    console.log(expectedPrices);
    await expect(numericPrices).toEqual(expectedPrices);
});