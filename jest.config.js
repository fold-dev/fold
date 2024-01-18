module.exports = {
    verbose: true,
    preset: 'ts-jest',
    modulePathIgnorePatterns: ['.dist/'],
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['**/*.test.tsx'],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
        '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
    setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
}
