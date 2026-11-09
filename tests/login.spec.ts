import { test, expect } from '../fixtures/testFixture';
import { testUsers } from '../data/testUsers';
import { ProductPage } from '../pages/ProductPage';
import { invalidLoginData } from '../data/invalidLoginData';

const specialUsers = [
    {name : 'performance_glitch_user',
    credentials : testUsers.performanceGlitchUser
    },
    {name : 'problem_user',
    credentials : testUsers.problemUser
    },
    {name : 'error_user',
    credentials : testUsers.errorUser
    },
    {name : 'visual_user',
    credentials : testUsers.visualUser
    }
];

for (const data of invalidLoginData) {
    test(`Should display error message when login with invalid credentials: ${data.scenario}`, async ({ loginPage }) => {
        await loginPage.login(data.username, data.password);
        await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
    });
}

test('Login functionality test', async ({ page, loginPage }) => {

  await loginPage.login(testUsers.standardUser.username, testUsers.standardUser.password);

  await expect(page).toHaveURL(/inventory.html/);

  await expect(page.locator('.title')).toHaveText('Products');
});

test('Should display error message when login with invalid credentials', async ({ page, loginPage }) => {

  await loginPage.login('invalid_user', 'invalid_password');

  await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service'
);
});

test('Should display error message when login with empty credentials', async ({ page, loginPage }) => {

  await loginPage.login('', '');
  await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
});

test('Should display error message when login with empty password', async ({ page, loginPage }) => {

  await loginPage.login(testUsers.standardUser.username, '');
  await expect(loginPage.errorMessage).toHaveText('Epic sadface: Password is required');
});

test('Should display error message when login with empty username', async ({ page, loginPage }) => {

  await loginPage.login('', testUsers.standardUser.password);
  await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
}); 

test('Should display error message when login with locked out user', async ({ page, loginPage }) => {

  await loginPage.login(testUsers.lockedOutUser.username, testUsers.lockedOutUser.password);
  await expect(loginPage.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
});

test('Should logout successfully', async ({ page, loginPage  }) => {

  await loginPage.login(testUsers.standardUser.username, testUsers.standardUser.password);
  await expect(page).toHaveURL(/inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');

  const productPage = new ProductPage(page);
  await productPage.logout();
  await expect(page).toHaveURL('https://www.saucedemo.com/');   
  await expect(loginPage.loginButton).toBeVisible();
});

for (const user of specialUsers) {
    test(`Should login successfully with special user: ${user.name}`, async ({ page, loginPage }) => {

        await loginPage.login(user.credentials.username, user.credentials.password);

        const productPage = new ProductPage(page);
        const timeout = user.name === 'performance_glitch_user' ? 30000 : 5000; // Adjust timeout for performance glitch user
        await expect(page).toHaveURL(/inventory.html/, { timeout });
        await expect(productPage.backpackProductName).toBeVisible({ timeout });
    });
    }