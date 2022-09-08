import type { Config } from "@jest/types";
import { defaults as tsjPresent } from "ts-jest/presets";

export default (): Config.InitialOptions => {
    return {
        collectCoverage: false,
        collectCoverageFrom: ["src/**/*.{ts,js}"],
        displayName: {
            name: "aws-lambda-router",
            color: "blue",
        },
        moduleDirectories: ["node_modules", "src"],
        moduleNameMapper: {
            "src/(.*)": "<rootDir>/src/$1",
            "tests/(.*)": "<rootDir>/tests/$1",
        },
        resetMocks: true,
        testMatch: [
            "**/tests/**/*+(spec|test).+(ts)",
        ],
        testPathIgnorePatterns: [
            ".d.ts",
            ".js",
            "node_modules/(?!variables/.*)",
        ],
        ...tsjPresent,
        verbose: true,
    };
};
