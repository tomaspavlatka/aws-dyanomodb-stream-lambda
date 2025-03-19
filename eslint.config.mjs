import pluginJs from "@eslint/js";
import perfectionist from 'eslint-plugin-perfectionist'
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  { ignores: ["dist/*", "data/*"] },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-decorators": "error",
      "perfectionist/sort-enums": "error",
      "perfectionist/sort-heritage-clauses": "error",
      "perfectionist/sort-imports": "error",
      "perfectionist/sort-interfaces": "error",
      "perfectionist/sort-named-imports": "error",
      "perfectionist/sort-object-types": "error",
      "perfectionist/sort-switch-case": "error",
      "perfectionist/sort-union-types": "error",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
