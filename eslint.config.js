import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: [".output/", "dist/", "node_modules/"],
  },
);
