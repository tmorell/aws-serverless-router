module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "./.eslintrc.ext",
    ],
    ignorePatterns: [
        "**/*.js",
        "docs",
        "layers",
        "lib",
        "node_modules",
    ],
    parser: "@typescript-eslint/parser",
    plugins: [
        "eslint-plugin-jest",
        "@typescript-eslint",
    ],
    root: true,
};
