const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: './src',
    testRegex: ['/src/.*\\.test\\.ts$|/src/.*\\.spec\\.ts$'],
    testTimeout: 30000,
    globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.json',  // Make sure your tsconfig.json is correctly set up
        },
    },
    transform: {
        '^.+\\.ts$': 'ts-jest',  // Ensure .ts files are transformed using ts-jest
    },
};
