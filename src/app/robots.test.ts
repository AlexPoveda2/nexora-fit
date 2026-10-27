import type { MetadataRoute } from "next";

// env.ts lee process.env una sola vez al importarse, así que cada caso reimporta el módulo
// con jest.isolateModules después de fijar la variable (si no, el segundo test vería el
// valor cacheado del primero).
function robotsWith(indexable: string | undefined): MetadataRoute.Robots {
  const originalValue = process.env.NEXT_PUBLIC_INDEXABLE;
  process.env.NEXT_PUBLIC_INDEXABLE = indexable;

  let result!: MetadataRoute.Robots;
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- necesario para forzar la reimportación
    result = require("./robots").default();
  });

  process.env.NEXT_PUBLIC_INDEXABLE = originalValue;
  return result;
}

describe("robots", () => {
  it("bloquea todo el sitio mientras NEXT_PUBLIC_INDEXABLE no sea 'true'", () => {
    expect(robotsWith(undefined)).toEqual({
      rules: { userAgent: "*", disallow: "/" },
    });
  });

  it("deja indexar cuando se activa el lanzamiento", () => {
    expect(robotsWith("true")).toEqual({
      rules: { userAgent: "*", disallow: [] },
    });
  });
});
