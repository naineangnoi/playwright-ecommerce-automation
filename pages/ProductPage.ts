import {Page, Locator} from '@playwright/test'; 

export class ProductPage {

    readonly menuButton: Locator;
    readonly logoutLink: Locator;
    readonly addBackpackButton: Locator;
    readonly removeBackpackButton: Locator;     
    readonly cartBadge: Locator;
    readonly priceSortDropdown: Locator;
    readonly productPrices: Locator;
    
    constructor(page: Page) {
        this.menuButton = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('#logout_sidebar_link');
        this.addBackpackButton = page.locator('#add-to-cart-sauce-labs-backpack');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.removeBackpackButton = page.locator('#remove-sauce-labs-backpack');
        this.priceSortDropdown = page.locator('[data-test="product-sort-container"]');
        this.productPrices = page.locator('.inventory_item_price');
    }

    async logout() {
        await this.menuButton.click();
        await this.logoutLink.click();
    }

    async addBackpackToCart() {
        await this.addBackpackButton.click();
    }

    async removeBackpackFromCart() {
        await this.removeBackpackButton.click();
    }
}