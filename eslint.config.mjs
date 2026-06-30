import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // CLAUDE.md TIER 1 : typage fort, zéro `any`.
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  // Désactive les règles de style en conflit avec Prettier (doit rester en dernier).
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    // Client Prisma généré (non versionné).
    "src/generated/**",
  ]),
]);

export default eslintConfig;
