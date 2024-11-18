import { HttpResponse } from './Contracts/HttpResponse';
import { APIHttpResponse } from './Contracts/APIHttpResponse';
import { Logger } from './Logger';
import { EventResponse } from './Contracts/EventResponse';
const { inherits } = require('util');

const API_200: any = {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Expose-Headers': 'Authorization',
    },
    body: null,
};

const statuses: any = {
    '100': 'Continue',
    '101': 'Switching Protocols',
    '102': 'Processing',
    '103': 'Early Hints',
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '203': 'Non-Authoritative Information',
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
    '207': 'Multi-Status',
    '208': 'Already Reported',
    '226': 'IM Used',
    '300': 'Multiple Choices',
    '301': 'Moved Permanently',
    '302': 'Found',
    '303': 'See Other',
    '304': 'Not Modified',
    '305': 'Use Proxy',
    '306': '(Unused)',
    '307': 'Temporary Redirect',
    '308': 'Permanent Redirect',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '406': 'Not Acceptable',
    '407': 'Proxy Authentication Required',
    '408': 'Request Timeout',
    '409': 'Conflict',
    '410': 'Gone',
    '411': 'Length Required',
    '412': 'Precondition Failed',
    '413': 'Payload Too Large',
    '414': 'URI Too Long',
    '415': 'Unsupported Media Type',
    '416': 'Range Not Satisfiable',
    '417': 'Expectation Failed',
    '418': "I'm a teapot",
    '421': 'Misdirected Request',
    '422': 'Unprocessable Entity',
    '423': 'Locked',
    '424': 'Failed Dependency',
    '425': 'Unordered Collection',
    '426': 'Upgrade Required',
    '428': 'Precondition Required',
    '429': 'Too Many Requests',
    '431': 'Request Header Fields Too Large',
    '451': 'Unavailable For Legal Reasons',
    '500': 'Internal Server Error',
    '501': 'Not Implemented',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Timeout',
    '505': 'HTTP Version Not Supported',
    '506': 'Variant Also Negotiates',
    '507': 'Insufficient Storage',
    '508': 'Loop Detected',
    '509': 'Bandwidth Limit Exceeded',
    '510': 'Not Extended',
    '511': 'Network Authentication Required',
};

const API_500: any = {
    statusCode: 500,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: null,
};

export function THROW_API_ERROR(error: HttpResponse, token?: string): APIHttpResponse {
    Logger.error('APIResponse.Error', { error });
    if (token) {
        API_500['headers']['Authorization'] = `Bearer ${token}`;
    }
    const code = error.code ? error.code : 500;
    const { message } = error;

    if (code === 422) {
        const errors = error.errors;
        return {
            ...API_500,
            statusCode: code,
            body: JSON.stringify({
                code,
                message,
                errors,
            }),
        };
    }

    return {
        ...API_500,
        statusCode: code,
        body: JSON.stringify({
            code,
            message,
        }),
    };
}

const createErrorRegexp = /[^a-zA-Z]/g;
export const createError = (code: number, message?: string, errors?: any, properties = {}): Error => {
    const name = statuses[code].replace(createErrorRegexp, '');
    const className = name.substr(-5) !== 'Error' ? name + 'Error' : name;

    function HttpError(message: any) {
        // create the error object
        const msg = message ?? statuses[code];
        const err = new Error(msg);

        // capture a stack trace to the construction point
        Error.captureStackTrace(err, HttpError);

        // adjust the [[Prototype]]
        Object.setPrototypeOf(err, HttpError.prototype);

        // redefine the error message
        Object.defineProperty(err, 'message', {
            enumerable: true,
            configurable: true,
            value: msg,
            writable: true,
        });

        // redefine the error name
        Object.defineProperty(err, 'name', {
            enumerable: false,
            configurable: true,
            value: className,
            writable: true,
        });

        if (errors) {
            Object.defineProperty(err, 'errors', {
                enumerable: false,
                configurable: true,
                value: errors,
                writable: true,
            });
        }

        return err;
    }

    inherits(HttpError, Error);
    const desc = Object.getOwnPropertyDescriptor(HttpError, 'name');
    if (desc) {
        desc.value = className;
        Object.defineProperty(HttpError, 'name', desc);
    }

    Object.assign(
        HttpError.prototype,
        {
            status: code,
            statusCode: code,
            expose: code < 500,
        },
        properties,
    );

    return HttpError(message);
};

export function API_RESPONSE(data: HttpResponse, requestId?: string, token?: string): APIHttpResponse {
    Logger.debug('APIResponse.Success', { data });
    if (requestId) {
        API_200['headers']['x-correlation-id'] = requestId;
    }

    if (token) {
        API_200['headers']['Authorization'] = `Bearer ${token}`;
    }
    return {
        ...API_200,
        statusCode: 200,
        body: JSON.stringify(data),
    };
}

export function HTML_RESPONSE(html: string, statusCode = 200): APIHttpResponse {
    Logger.debug('HTMLResponse.Success', { html });

    return {
        headers: {
            'Content-Type': 'text/html',
        },
        statusCode,
        body: html,
    };
}

export function THROW_ERROR(error: EventResponse): EventResponse {
    Logger.error('Event Response Error', { error });

    const code: number = error.code ? error.code : 500;
    const { message } = error;

    if (code === 422) {
        const { errors } = error;
        return {
            code,
            message,
            errors,
        };
    }

    return {
        code,
        message,
    };
}

export function RESPONSE(response: EventResponse): EventResponse {
    Logger.error('Event Response', { response });
    return response;
}
