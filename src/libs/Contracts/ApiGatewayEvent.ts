//import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { SessionPayload } from '../../functions/middlewares/cognito_verify_token_authorization/handler';

interface Headers {
    Authorization: string;
}

interface Headers {
    Authorization: string;
}

export interface RequestContext {
    authorizer?: {
        session?: string;
        token?: string;
        principalId?: string;
        session_payload?: string;
    };
    requestTimeEpoch?: bigint;
    path?: string;
}

export interface ApiGatewayEvent {
    source?: string;
    headers?: Headers;
    body: string;
    requestContext?: RequestContext;
    queryStringParameters?: {
        [key: string]: any;
    };
    pathParameters?: {
        [key: string]: any;
    };
}

export interface Event {
    source?: string;
    methodArn: string;
    authorizationToken: string;
}
