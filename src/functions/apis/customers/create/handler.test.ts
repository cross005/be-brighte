import { ApiGatewayEvent } from '../../../../libs/Contracts/ApiGatewayEvent';
import { execute } from './handler';
import { CustomerCreateRequest, Services } from './requests';


test('422: PARAMETER ERROR', async () => {
    const event: ApiGatewayEvent = {
        body: JSON.stringify(<CustomerCreateRequest>{
            name: '',
            mobile: '',
            email: '',
            postcode: '',
            services: Services.DELIVERY,
        }),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('errors');

    expect(result.statusCode).toBe(422);
    expect(response.code).toBe(422);
});

test('200: SUCCESS', async () => {
    const event: ApiGatewayEvent = {
        body: JSON.stringify(<CustomerCreateRequest>{
            name: "AJ",
            mobile: "+639664482233",
            postcode: "4022",
            email: "random@email.com",
            services: Services.DELIVERY
        }),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);
    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');

    expect(result.statusCode).toBe(200);
    expect(response.code).toBe(200);
});
