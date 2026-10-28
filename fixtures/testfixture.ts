import {test as base} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';
import {ProductPage} from '../pages/ProductPage';
import {testUsers } from '../data/testUsers';

type MyFixtures = {
    loginPage: LoginPage;
    productPage: ProductPage;
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
}); 

export {expect} from '@playwright/test';