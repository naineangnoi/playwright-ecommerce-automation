import { Page, Locator } from '@playwright/test';
 
export class CheckoutOverviewPage {
    readonly page: Page;
    readonly finishButton: Locator;
    readonly cancelButton: Locator;
    readonly confirmationMessage: Locator;
    readonly itemTotal: Locator;
    readonly tax: Locator;
    readonly total: Locator;
    readonly ProductPrice: Locator;

    constructor(page: Page) {
        this.page = page;
        this.finishButton = page.locator('#finish');
        this.cancelButton = page.locator('#cancel');
        this.confirmationMessage = page.locator('.complete-header');
        this.itemTotal = page.locator('.summary_subtotal_label');
        this.tax = page.locator('.summary_tax_label');  
        this.total = page.locator('.summary_total_label');
        this.ProductPrice = page.locator('.inventory_item_price');
    }

    async finishCheckout() {
        await this.finishButton.click();
    }

    async cancelCheckout() {
        await this.cancelButton.click();
    }
}   