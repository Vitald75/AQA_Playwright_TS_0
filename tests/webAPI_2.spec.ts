// 1 Login UI -> store all storage information into .json

import { test, expect } from '@playwright/test';
import { TIMEOUT } from 'node:dns';
let webContext;


test.beforeAll( async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('input[id="userEmail"]');
    const password = page.locator('input[id="userPassword"]');
    
    // login 
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await userName.fill('aA12345678@gmail.com');
    await password.fill('aA12345678');
    await page.locator('input[id="login"]').click();
    await context.storageState({path: 'state.json'});

    webContext = await browser.newContext({storageState : 'state.json'});


});



test('Site2. E2E - login, add to cart using API', async ({})=>
{
    const productName = 'iphone 13 pro';

    const page = await webContext.newPage();
    const products = page.locator('[class="card-body"]');
    const cartButton = page.locator('button[routerlink="/dashboard/cart"]');
    const checkoutButton = page.locator('div.subtotal button[type="button"]');
    
    const creditCard = page.locator('i.icon-credit-card');
    const selectCountryInput = page.locator('input[placeholder="Select Country"]');
    const dropdownCountry = page.locator('section.ta-results');
    const placeOrderButton = page.locator('.action__submit');
    const orderHistoryLink = page.locator('label[routerlink="/dashboard/myorders"]');
    const ordersInTable = page.locator('tbody tr th');  

    await page.goto('https://rahulshettyacademy.com/client/#/dashboard/');
    //await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/dash");
    //await expect(page).toHaveTitle("Let's Shop");
    await products.last().waitFor();
    const count = await products.count();

    // add to Cart 
    for (let i=0; i < count; i++)
    {
        if ((await products.nth(i).locator('b').textContent()) === productName) {
        // add to Cart
            await products.nth(i).locator('i.fa-shopping-cart').click();
            await expect(page.locator('button[routerlink="/dashboard/cart"] label')).toHaveText('1');
            console.log(i, await products.nth(i).textContent());
            break;
        }
    }

    // check the cart
    await cartButton.click();
    await expect(page).toHaveURL('https://rahulshettyacademy.com/client/#/dashboard/cart');
    await page.locator('div li').last().waitFor();
    await expect(page.locator('.cartSection h3')).toHaveText(productName);

    const bool = await page.locator(`h3:has-text("${productName}")`).isVisible();
    expect(bool).toBeTruthy();

    // visit checkout page
    await checkoutButton.click();
    await expect(page.locator('.item__title')).toHaveText(productName);
    await selectCountryInput.pressSequentially('ind', { delay: 150 });
    await dropdownCountry.waitFor();
    await dropdownCountry.locator('text= India').last().click();
    
    await expect(selectCountryInput).toHaveValue('India');
    await expect(page.locator('.user__name label')).toHaveText('aA12345678@gmail.com');

    await placeOrderButton.click();
    await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');
    const orderNumberString = await page.locator('label.ng-star-inserted').textContent();
    const orderNumber = orderNumberString?.split(' ')[2];

    // visit Orders History Page
    await orderHistoryLink.click();
    await expect(page.locator('h1.ng-star-inserted').first()).toHaveText('Your Orders');
    await expect(ordersInTable.locator(`text=${orderNumber}`)).toBeInViewport();
    
    //visit order datails page
    const viewOrderButton = page.locator(`//tbody/tr/th[contains(text(),"${orderNumber}")]/parent::tr/td/button`).first();
    await viewOrderButton.click();
    const orderNumber2 = await page.locator('.col-text').textContent();
    expect(orderNumber).toEqual(orderNumber2);
    // another way to expect
    expect(orderNumber2?.includes(orderNumber)).toBeTruthy();
    // await page.pause();
   
});




// 2 before tests, inject .json into browser.context