import { test, expect, request } from '@playwright/test';
import { TIMEOUT } from 'node:dns';
import { ApiUtils } from 'd:/PlayWright_Projects/AQA_Playwright_TS_0/tests/Utils/ApiUtils.js';

const loginPayload = {userEmail: "aA12345678@gmail.com", userPassword: "aA12345678"};
const addItemPayload = {orders: [{country: "India", productOrderedId: "6960ea76c941646b7a8b3dd5"}]};

let response = {};
const fakeResponse = {data:[],message:"No Orders"};


test.beforeAll( async () => 
{
    const apiContext = await request.newContext();
    const apiUtils = new ApiUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(addItemPayload);
})

test('Site2. E2E - Place the order', async ({ page })=>
{
    // const productName = 'iphone 13 pro';
    const products = page.locator('[class="card-body"]');
    const orderHistoryLink = page.locator('button[routerlink="/dashboard/myorders"]');
    const ordersInTable = page.locator('tbody tr th');  

    // 
    page.addInitScript( value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto('https://rahulshettyacademy.com/client/'); 

    await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/dash");
    await expect(page).toHaveTitle("Let's Shop");
    await products.last().waitFor();
 

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => 
            {
                const response = await page.request.fetch(route.request());
                let body = JSON.stringify(fakeResponse);  
                await route.fulfill(
                    {          
                        response,
                        body, 
                    });
            });

            
    // visit Orders History Page
    await orderHistoryLink.click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");

    //await page.pause();
    await expect(page.locator('*.mt-4')).toHaveText(' You have No Orders to show at this time. Please Visit Back Us ');
    // await expect(ordersInTable.locator(`text=${response.orderId}`)).toBeInViewport();
    
    // // visit order datails page
    // const viewOrderButton = page.locator(`//tbody/tr/th[contains(text(),"${response.orderId}")]/parent::tr/td/button`).first();
    // await viewOrderButton.click();
    // const orderNumber2 = await page.locator('.col-text').textContent();
    // expect(response.orderId).toEqual(orderNumber2);
    // // another way to expect
    // expect(orderNumber2?.includes(response.orderId)).toBeTruthy();
    // await page.pause();
   
});



