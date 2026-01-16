import { test, expect } from '@playwright/test';

test('Special locators', async ({page})=>
{
    const url = 'https://rahulshettyacademy.com/angularpractice/';
    // const userName = page.locator('input[id="userEmail"]');
    // const password = page.locator('input[id="userPassword"]');
    // const products = page.locator('[class="card-body"]');
    // const cartButton = page.locator('button[routerlink="/dashboard/cart"]');
    // const checkoutButton = page.locator('div.subtotal button[type="button"]');
    
    // const creditCard = page.locator('i.icon-credit-card');
    // const selectCountryInput = page.locator('input[placeholder="Select Country"]');
    // const dropdownCountry = page.locator('section.ta-results');
    // const placeOrderButton = page.locator('.action__submit');
    // const orderHistoryLink = page.locator('label[routerlink="/dashboard/myorders"]');
    // const ordersInTable = page.locator('tbody tr th');  

    // login 
    await page.goto(url);
    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await page.getByLabel("Employed").click();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("newpassword");


    await page.getByRole("button", {name : "Submit"}).click();
    
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();

    await page.getByRole("link", {name:"Shop"}).click();
    await page.locator("app-card").filter({ hasText : "Nokia Edge"}).getByRole("button", {name : "Add "}).click();
    
    await page.pause();
   
});
