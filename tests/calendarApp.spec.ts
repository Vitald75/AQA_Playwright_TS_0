import { test, expect } from '@playwright/test';
 
 
test("Calendar validations",async({page})=>
{ 
    const monthNumber = "6";
    const date = "15";
    const year = "2027";
    const expectedList = [monthNumber,date,year];
    
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    await page.locator(".react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.getByText(year).click();
    await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber)-1).click();
    await page.locator("//abbr[text()='"+date+"']").click();
 

    const data = await page.locator("[name='date']").getAttribute('value');
    //console.log(data); // 2027-06-15
    const data_array = data?.split('-');
    //console.log(data_array);  // [ '2027', '06', '15' ]
    
    expect (year).toEqual(data_array[0]);
    expect (Number(monthNumber)).toEqual(Number(data_array[1]));
    expect (Number(date)).toEqual(Number(data_array[2]));
    
    // another way 
    // const inputs =  page.locator('.react-date-picker__inputGroup__input');
    // for(let i =0; i<expectedList.length;i++)
    // {
    //     const value = await inputs.nth(i).inputValue();
    //     expect(value).toEqual(expectedList[i]);
    // }

}
)
