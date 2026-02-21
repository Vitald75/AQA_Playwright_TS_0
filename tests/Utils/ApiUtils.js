export class ApiUtils {

    constructor(apiContext, loginPayload) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    async getToken() 
    {   

        // Login API 
        const loginResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', 
        {
            data : this.loginPayload
        });
        
        //expect(loginResponse.ok()).toBeTruthy();
        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;  
        console.log(token);
        return token;
    }

    async createOrder(addItemPayload) {

        let response = {};
        response.token = await this.getToken();

        const orderItemResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order', 
        {
            data : addItemPayload,
            headers : {  'Authorization' : response.token,
                         'Content-Type'  : 'application/json'
                }  
        });       
                
        const orderItemResponseJson = await orderItemResponse.json();
        const orderId = orderItemResponseJson.orders[0];
        console.log(orderId);
        response.orderId = orderId;
        return response;

    }
}

//export default { ApiUtils };

