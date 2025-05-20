import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // ✅ Tắt rule không cần thiết
      "@typescript-eslint/no-empty-object-type": "off",

      // ✅ Bắt dùng === thay vì ==
      eqeqeq: ["warn", "always"],

      // ✅ Cảnh báo nếu có console.log
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];

export default eslintConfig;
