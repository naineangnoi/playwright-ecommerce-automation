import {Page, Locator} from '@playwright/test'; 

export class ProductPage {
    readonly page: Page;
    readonly menuButton: Locator;
    readonly logoutLink: Locator;
    readonly addBackpackButton: Locator;
    readonly removeBackpackButton: Locator;     
    readonly cartBadge: Locator;
    readonly priceSortDropdown: Locator;
    readonly productPrices: Locator;
    readonly cartLink: Locator;
    readonly backpackProductName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.menuButton = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('#logout_sidebar_link');
        this.addBackpackButton = page.locator('#add-to-cart-sauce-labs-backpack');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.removeBackpackButton = page.locator('#remove-sauce-labs-backpack');
        this.priceSortDropdown = page.locator('[data-test="product-sort-container"]');
        this.productPrices = page.locator('.inventory_item_price');
        this.cartLink = page.locator('.shopping_cart_link');
        this.backpackProductName = page.getByRole('button', { name: 'View details for Sauce Labs Backpack'}).first();
    }

    getProductPriceLocator(productName: string): Locator {
    return this.page
        .locator('.inventory_item')
        .filter({
            has: this.page.getByText(productName, { exact: true })
        })
        .locator('.inventory_item_price');
}

    async logout() {
        await this.menuButton.click();
        await this.logoutLink.click();
    }

    async addProductToCart(productName: string) {
        const productButton = this.page.locator(`#add-to-cart-${productName.toLowerCase().replaceAll(' ', '-')}`);
        await productButton.click();
    }

    async removeBackpackFromCart() {
        await this.removeBackpackButton.click();
    }

    async viewCart() {
        await this.cartLink.click();    
    }   

    async getProductPrices(productName: string): Promise<number[]> {
        const productPrices = await this.productPrices.all();
        const prices: number[] = [];

        for (const price of productPrices) {
            const text = await price.textContent();
            if (text) {
                const numericPrice = parseFloat(text.replace('$', ''));
                prices.push(numericPrice);
            }
        }

        return prices;
    }

    async getProductPriceByName(productName: string): Promise<number> {
    const priceText = await this.getProductPriceLocator(productName).innerText();

    return Number(priceText.replace('$', ''));
}
}