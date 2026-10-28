import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import boundaries from "eslint-plugin-boundaries";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

// Capas de una feature (guía front §2.1). Las de admin/ van primero porque están un nivel más
// adentro (src/features/admin/<feature>/…) y el patrón genérico no las reconoce.
const LAYERS = ["domain", "application", "infrastructure", "ui"];
const featureElements = LAYERS.flatMap((layer) => [
  { type: layer, pattern: `src/features/admin/*/${layer}/**`, mode: "full", capture: ["feature"] },
  { type: layer, pattern: `src/features/*/${layer}/**`, mode: "full", capture: ["feature"] },
]);

const sameFeature = (type) => [type, { feature: "${from.feature}" }];

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "next-env.d.ts",
      "src/shared/infrastructure/api/schema.d.ts",
    ],
  },
  {
    plugins: { boundaries },
    settings: {
      "import/resolver": { typescript: { project: "./tsconfig.json" } },
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**", mode: "full" },
        { type: "di", pattern: "src/core/use-container.ts", mode: "full" }, // antes que "core"
        { type: "core", pattern: "src/core/**", mode: "full" },
        ...featureElements,
        {
          type: "feature-api",
          pattern: "src/features/admin/*/index.ts",
          mode: "full",
          capture: ["feature"],
        },
        {
          type: "feature-api",
          pattern: "src/features/*/index.ts",
          mode: "full",
          capture: ["feature"],
        },
        { type: "shared-domain", pattern: "src/shared/domain/**", mode: "full" },
        { type: "shared-infra", pattern: "src/shared/infrastructure/**", mode: "full" },
        { type: "shared-ui", pattern: "src/shared/ui/**", mode: "full" },
        { type: "shared-lib", pattern: "src/shared/lib/**", mode: "full" },
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "domain", allow: ["shared-domain", sameFeature("domain")] },
            {
              from: "application",
              allow: ["shared-domain", sameFeature("domain"), sameFeature("application")],
            },
            {
              from: "infrastructure",
              allow: [
                "shared-domain",
                "shared-infra",
                sameFeature("domain"),
                sameFeature("application"),
                sameFeature("infrastructure"),
              ],
            },
            {
              from: "ui",
              allow: [
                "shared-domain",
                "shared-ui",
                "shared-lib",
                "feature-api",
                "di",
                sameFeature("domain"),
                sameFeature("application"),
                sameFeature("ui"),
              ],
            },
            {
              from: "feature-api",
              allow: [sameFeature("ui"), sameFeature("domain"), sameFeature("application")],
            },
            // "app" se importa a sí mismo: layout.tsx usa ./globals.css (ajuste a la guía §2.5).
            // shared-infra se permite solo para los archivos de convención de Next sin lógica
            // de negocio (robots.ts, sitemap.ts, middleware.ts), que leen env.ts (TF-6).
            {
              from: "app",
              allow: [
                "app",
                "feature-api",
                "core",
                "shared-ui",
                "shared-lib",
                "shared-domain",
                "shared-infra",
              ],
            },
            { from: ["core", "di"], allow: ["*"] },
            {
              from: ["shared-infra", "shared-lib"],
              allow: ["shared-domain", "shared-lib"],
            },
            // shared-ui se permite a sí mismo: los componentes de shadcn se componen entre
            // ellos (Dialog usa Button, Command usa InputGroup) (TF-7).
            {
              from: "shared-ui",
              allow: ["shared-domain", "shared-lib", "shared-ui"],
            },
          ],
        },
      ],
    },
  },
  {
    // El núcleo es TypeScript puro: sin React, Next.js, Axios, Zod ni TanStack.
    files: ["src/features/**/domain/**", "src/features/**/application/**", "src/shared/domain/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "react",
            "react-dom",
            "next",
            "next/*",
            "axios",
            "zod",
            "@tanstack/*",
            "@/shared/infrastructure/*",
            "@/core/*",
          ],
        },
      ],
    },
  },
  {
    // La UI no sabe cómo se habla con el backend (guía front §1.2).
    files: ["src/features/**/ui/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          // "**/infrastructure/**" cubre @/shared, @/features/…, admin/* y rutas relativas.
          patterns: ["axios", "**/infrastructure", "**/infrastructure/**"],
        },
      ],
    },
  },
];

export default eslintConfig;
