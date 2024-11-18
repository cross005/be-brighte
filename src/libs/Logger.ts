// @ts-nocheck
import { inspect } from 'util';

enum LogLevels {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

// most of these are available through the Node.js execution environment for Lambda
// see https://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html
const DEFAULT_CONTEXT = {
    awsRegion: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
    functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
    functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
    functionMemorySize: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
    stage: process.env.ENVIRONMENT || process.env.STAGE,
};

export class Logger {
    static error(name: string, payload: unknown): void {
        console.error(name, inspect(payload, { depth: null }));
    }

    static info(name: string, payload: unknown): void {
        console.info(name, inspect(payload, { depth: null }));
    }

    static debug(name: string, payload: unknown): void {
        if (DEFAULT_CONTEXT.stage == 'local') {
            console.debug(name, inspect(payload, { depth: null }));
        }
        console.debug(name);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static logLevelName() {
        return process.env.log_level || 'DEBUG';
    }

    // eslint-disable-next-line no-implicit-any
    public static isEnabled(level) {
        return level >= LogLevels[this.logLevelName()];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static appendError(params: any, err: any) {
        if (!err) {
            return params;
        }

        return Object.assign(params || {}, {
            errorName: err.name,
            errorMessage: err.message,
            stackTrace: err.stack,
        });
    }

    private static log(levelName: string, message: string, ...params): void {
        if (!this.isEnabled(LogLevels[levelName])) {
            return;
        }

        //const logMsg: Record<string, unknown> = Object.assign({}, params);
        let logMsg: Record<string, unknown> = {};
        logMsg = { ...logMsg, params };
        logMsg.level = levelName;
        logMsg.message = message;

        console.log(JSON.stringify(logMsg));
    }

    public static inquiroDebug(msg: string, params: unknown): void {
        this.log('DEBUG', msg, params);
    }

    public static inquiroInfo(msg: string, params: unknown): void {
        this.log('INFO', msg, params);
    }

    public static inquiroWarn(msg: string, params: unknown, error: unknown): void {
        this.log('WARN', msg, this.appendError(params, error));
    }

    public static inquiroError(msg: string, params: unknown, error: unknown): void {
        this.log('ERROR', msg, this.appendError(params, error));
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static enableDebug = () => {
        const oldLevel = process.env.log_level;
        process.env.log_level = 'DEBUG';

        // return a function to perform the rollback
        return () => {
            process.env.log_level = oldLevel;
        };
    };
}
