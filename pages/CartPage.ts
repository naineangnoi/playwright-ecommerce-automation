import {Page, Locator} from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly productName: Locator;
    readonly continueShoppingButton: Locator;
    readonly removeButton: Locator;
    readonly checkoutButton: Locator;
    readonly confirmationMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productName = page.locator('.cart_item .inventory_item_name');
        this.continueShoppingButton = page.locator('#continue-shopping');
        this.removeButton = page.locator('#remove-sauce-labs-backpack');
        this.checkoutButton = page.locator('#checkout');
        this.confirmationMessage = page.locator('.complete-header');
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }

    async removeProduct() {
        await this.removeButton.click();
    }


}
