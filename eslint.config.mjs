import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            "no-case-declarations": "off",
            "react/react-in-jsx-scope": "off",
            "react/no-unknown-property": "off",
            "import/no-named-as-default": "off",
            "react-hooks/set-state-in-effect": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "no-empty": "off",

            "react-hooks/exhaustive-deps": "warn",
            "react-hooks/rules-of-hooks": "warn",
            "no-console": "warn",
            "prefer-const": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
        },
    },

    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
