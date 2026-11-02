
import {Page, Locator, expect} from '@playwright/test';

export class CheckoutCompletePage {
    readonly page: Page;
    readonly completeHeader: Locator;
    readonly generatedPdfButton: Locator;
    readonly backHomeButton: Locator;   
    readonly confirmationMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.completeHeader = page.locator('.complete-header');
        this.generatedPdfButton = page.getByRole('button', {
                                name: 'Generate PDF order',
                                exact: true
        });
        this.backHomeButton = page.locator('#back-to-products');
        this.confirmationMessage = page.locator('.complete-header');
    }

    async generatePdfOrder() {

    await expect (this.generatedPdfButton).toBeVisible();

    const downloadPromise = this.page.waitForEvent('download');

    await this.generatedPdfButton.click();

    return await downloadPromise;
}
    
}   