import { HttpResponse } from '../../../../libs/Contracts/HttpResponse';

export class Responses {
    static STATUS_200: HttpResponse = {
        code: 200,
        message: 'Success',
    };

    static STATUS_422: HttpResponse = {
        code: 422,
        message: 'Invalid request',
    };

    static STATUS_401: HttpResponse = {
        code: 401,
        message: 'Unauthorized request',
    };

    static STATUS_500: HttpResponse = {
        code: 500,
        message: 'Internal Server Error',
    };
}

export class InvalidRequest {
    public code = 422;
    public message = 'Invalid parameter requested';
}
