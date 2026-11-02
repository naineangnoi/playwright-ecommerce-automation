import {test as base} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';
import {ProductPage} from '../pages/ProductPage';
import {testUsers } from '../data/testUsers';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

type MyFixtures = {
    loginPage: LoginPage;
    productPage: ProductPage;
    checkoutCompletePage: CheckoutCompletePage;
};

export const test = base.extend<MyFixtures>({

    loginPage: async ({page}, use) => {

        const loginPage = new LoginPage(page);
        await loginPage.goTo();
        await use(loginPage);
    },
    productPage: async ({page}, use) => {

        const loginPage = new LoginPage(page);
        await loginPage.goTo();
        await loginPage.login(testUsers.standardUser.username, testUsers.standardUser.password);

        const productPage = new ProductPage(page);
        await use(productPage);
    },
    checkoutCompletePage: async ({page}, use) => {

        const checkoutCompletePage = new CheckoutCompletePage(page);
        await use(checkoutCompletePage);
    }
}); 

export {expect} from '@playwright/test';