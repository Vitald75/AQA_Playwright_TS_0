import { test, expect } from '@playwright/test';


test('Browser Context Declaration Playwright test', async ({browser})=>
{
    //step1 - open browser
    const context = await browser.newContext(); 
    const page = await context.newPage();
    await page.goto("https://www.ya.ru");
    const title = await page.title();
    console.log(title);
    expect(title).toContain("Яндекс");
    await expect(page).toHaveTitle("Яндекс — быстрый поиск в интернете");

    //step2 - enter u/p
    //step3 - clock submit
});

test('Invalid Login Page ', async ({page})=>
{
    //step1 - open browser
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await page.locator('input[id="username"]').fill('rahulshetty');
    await page.locator('[id="password"]').fill('learning');
    
    await expect(page.locator('input[id="username"]')).toHaveValue('rahulshetty');
    await page.locator('#signInBtn').click();

    expect(await page.locator('[style*="block"]').textContent()).toContain('Incorrect username/password.');
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

});


test('Valid Login', async ({page})=>
{
    //step1 - open browser
    const userName = page.locator('input[id="username"]');
    const password = page.locator('[id="password"]');
    const cardTitles = page.locator('[class="card-body"] a');

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await userName.fill('rahulshettyacademy');
    await password.fill('learning');
    await page.locator('#signInBtn').click();

    //expect(await page.locator('[style*="block"]').textContent()).toContain('Incorrect username/password.');
    await expect(page).toHaveURL("https://rahulshettyacademy.com/angularpractice/shop");
    await expect(page).toHaveTitle("ProtoCommerce");


    console.log(await cardTitles.first().textContent());
    console.log(await cardTitles.allTextContents());

});


test('UI Controls', async ({page})=>
{
    //step1 - open browser
    const userName = page.locator('input[id="username"]');
    const password = page.locator('[id="password"]');
    const cardTitles = page.locator('[class="card-body"] a');
    const dropdown = page.locator('select[class="form-control"]');
    const radioUser = page.locator('[value="user"]');
    const okButton = page.locator('button[id="okayBtn"]');
    const termsCheckBox = page.locator('input#terms');
    const documentLink = page.locator("a[href*='document']");

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await userName.fill('rahulshettyacademy');
    await password.fill('learning');

    await dropdown.selectOption('consult');
    await radioUser.check();
    await okButton.click();
    await expect(radioUser).toBeChecked();
    await termsCheckBox.click();
    await expect(termsCheckBox).toBeChecked();
    //await page.pause();
    await expect(documentLink).toHaveAttribute("class","blinkingText");

    await documentLink.click();
    //await page.locator('#signInBtn').click();
});


test('Child windows handling', async ({browser})=>
{
    const context = await browser.newContext(); 
    const page = await context.newPage();

    const documentLink = page.locator("a[href*='document']");
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    //await page.pause();
    await expect(documentLink).toHaveAttribute("class","blinkingText");
    
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        documentLink.click()
    ]);
       
    await expect(newPage).toHaveURL('https://rahulshettyacademy.com/documents-request');

    const text = await newPage.locator('p.red').textContent();
    const arrayText = text.split('@');
    const domain = arrayText[1].split(' ')[0];
    console.log(domain);

    await page.bringToFront();
    await page.locator('#username').fill(domain);
    await page.pause();


});
