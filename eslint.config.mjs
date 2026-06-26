import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // We intentionally set state in a few effects for valid synchronization
      // cases (client mount guard, initial /api/auth/me fetch, closing menus on
      // route change). Downgrade from error to warning.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
