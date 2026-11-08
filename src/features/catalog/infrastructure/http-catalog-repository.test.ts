import type { AxiosInstance } from "axios";

import { AppError } from "@/shared/domain/errors";

import { HttpCatalogRepository } from "./http-catalog-repository";

// Prueba de contrato (guía front §11.2): respuestas reales de la API local con el catálogo
// sembrado (GET /api/v1/catalog y /api/v1/plans/boxeo), recortadas a lo necesario.
const catalogResponse = {
  plans: [
    {
      slug: "boxeo",
      sport: "BOX",
      name: "Boxeo",
      tagline: "Guardia, golpes y defensas desde cero, más combinaciones para progresar.",
      image_url: "",
      levels: ["basic", "intermediate"],
      product: { slug: "plan-boxeo", price_cop: 160000 },
    },
    {
      slug: "calistenia",
      sport: "CAL",
      name: "Calistenia",
      tagline: "Domina tu peso corporal: de australianas a la parada de manos.",
      image_url: "https://img.nexorafit.com/plans/calistenia.jpg",
      levels: ["basic", "intermediate"],
      product: { slug: "plan-calistenia", price_cop: 160000 },
    },
  ],
  pack: { slug: "pack-completo", price_cop: 240000, full_price_cop: 640000 },
  direct_access: { slug: "acceso-directo", price_cop: 80000, access_days: 30 },
};

const planResponse = {
  slug: "boxeo",
  name: "Boxeo",
  description: "Guardia, golpes y defensas desde cero, más combinaciones para progresar.",
  image_url: "",
  audience: ["Nunca has boxeado", "Quieres mejorar tu cardio"],
  equipment: ["Guantes", "Vendas"],
  levels: [
    {
      level: "basic",
      weeks: 4,
      days_per_week: 3,
      minutes_per_session: 50,
      outcome: "Dominas los fundamentos de boxeo.",
    },
    {
      level: "intermediate",
      weeks: 4,
      days_per_week: 4,
      minutes_per_session: 60,
      outcome: "Avanzas al siguiente nivel de boxeo.",
    },
  ],
  syllabus: [
    {
      category: { code: "GOL", name: "Golpes" },
      videos: [
        { id: "BOX-GOL-001", title: "Golpe recto" },
        { id: "BOX-GOL-002", title: "Golpe cruzado" },
      ],
    },
  ],
  free_sample: { video_id: "BOX-GOL-001", title: "Golpe recto", poster_url: null },
  sample_day: {
    title: "Boxeo — Día 1",
    duration_min: 50,
    blocks: [
      {
        type: "warmup",
        title: "Calentamiento",
        exercises: [{ name: "Movilidad articular general", reps_or_time: "5 min" }],
      },
    ],
    hidden_blocks: 1,
  },
  product: { slug: "plan-boxeo", price_cop: 160000 },
  pack: { slug: "pack-completo", price_cop: 240000 },
};

function fakeAxios(get: jest.Mock): AxiosInstance {
  return { get } as unknown as AxiosInstance;
}

function respondingWith(data: unknown): AxiosInstance {
  return fakeAxios(jest.fn().mockResolvedValue({ data }));
}

describe("getCatalog", () => {
  it("mapea el catálogo de la API a camelCase y deja los precios tal cual", async () => {
    const http = respondingWith(catalogResponse);

    const catalog = await new HttpCatalogRepository(http).getCatalog();

    expect(http.get).toHaveBeenCalledWith("/api/v1/catalog");
    expect(catalog).toEqual({
      plans: [
        {
          slug: "boxeo",
          sport: "BOX",
          name: "Boxeo",
          tagline: "Guardia, golpes y defensas desde cero, más combinaciones para progresar.",
          imageUrl: null,
          levels: ["basic", "intermediate"],
          product: { slug: "plan-boxeo", priceCop: 160000 },
        },
        {
          slug: "calistenia",
          sport: "CAL",
          name: "Calistenia",
          tagline: "Domina tu peso corporal: de australianas a la parada de manos.",
          imageUrl: "https://img.nexorafit.com/plans/calistenia.jpg",
          levels: ["basic", "intermediate"],
          product: { slug: "plan-calistenia", priceCop: 160000 },
        },
      ],
      pack: { slug: "pack-completo", priceCop: 240000, fullPriceCop: 640000 },
      directAccess: { slug: "acceso-directo", priceCop: 80000, accessDays: 30 },
    });
  });

  it("acepta un catálogo sin pack, sin acceso directo y con planes sin producto", async () => {
    const [boxeo] = catalogResponse.plans;
    const http = respondingWith({
      plans: [{ ...boxeo, product: null }],
      pack: null,
      direct_access: null,
    });

    const catalog = await new HttpCatalogRepository(http).getCatalog();

    expect(catalog.pack).toBeNull();
    expect(catalog.directAccess).toBeNull();
    expect(catalog.plans[0]?.product).toBeNull();
  });

  it("omite los niveles que el front no conoce en vez de romper la landing", async () => {
    const [boxeo] = catalogResponse.plans;
    const http = respondingWith({
      ...catalogResponse,
      plans: [{ ...boxeo, levels: ["basic", "elite"] }],
    });

    const catalog = await new HttpCatalogRepository(http).getCatalog();

    expect(catalog.plans[0]?.levels).toEqual(["basic"]);
  });
});

describe("getPlan", () => {
  it("mapea la página pública de un deporte", async () => {
    const http = respondingWith(planResponse);

    const plan = await new HttpCatalogRepository(http).getPlan("boxeo");

    expect(http.get).toHaveBeenCalledWith("/api/v1/plans/boxeo");
    expect(plan).toEqual({
      slug: "boxeo",
      name: "Boxeo",
      description: "Guardia, golpes y defensas desde cero, más combinaciones para progresar.",
      imageUrl: null,
      audience: ["Nunca has boxeado", "Quieres mejorar tu cardio"],
      equipment: ["Guantes", "Vendas"],
      levels: [
        {
          level: "basic",
          weeks: 4,
          daysPerWeek: 3,
          minutesPerSession: 50,
          outcome: "Dominas los fundamentos de boxeo.",
        },
        {
          level: "intermediate",
          weeks: 4,
          daysPerWeek: 4,
          minutesPerSession: 60,
          outcome: "Avanzas al siguiente nivel de boxeo.",
        },
      ],
      syllabus: [
        {
          category: { code: "GOL", name: "Golpes" },
          videos: [
            { id: "BOX-GOL-001", title: "Golpe recto" },
            { id: "BOX-GOL-002", title: "Golpe cruzado" },
          ],
        },
      ],
      freeSample: { videoId: "BOX-GOL-001", title: "Golpe recto", posterUrl: null },
      sampleDay: {
        title: "Boxeo — Día 1",
        durationMin: 50,
        blocks: [
          {
            type: "warmup",
            title: "Calentamiento",
            exercises: [{ name: "Movilidad articular general", repsOrTime: "5 min" }],
          },
        ],
        hiddenBlocks: 1,
      },
      product: { slug: "plan-boxeo", priceCop: 160000 },
      pack: { slug: "pack-completo", priceCop: 240000 },
    });
  });

  it("acepta un plan sin muestra, sin día de muestra y sin producto", async () => {
    const http = respondingWith({
      ...planResponse,
      free_sample: null,
      sample_day: null,
      product: null,
      pack: null,
    });

    const plan = await new HttpCatalogRepository(http).getPlan("boxeo");

    expect(plan).toMatchObject({ freeSample: null, sampleDay: null, product: null, pack: null });
  });

  it("muestra como 'other' un tipo de bloque que el front no conoce", async () => {
    const http = respondingWith({
      ...planResponse,
      sample_day: {
        ...planResponse.sample_day,
        blocks: [{ type: "stretching", title: null, exercises: [] }],
      },
    });

    const plan = await new HttpCatalogRepository(http).getPlan("boxeo");

    expect(plan?.sampleDay?.blocks).toEqual([{ type: "other", title: null, exercises: [] }]);
  });

  it("devuelve null si el deporte no existe, para que la página responda 404", async () => {
    const http = fakeAxios(jest.fn().mockRejectedValue(new AppError("NOT_FOUND", 404)));

    await expect(new HttpCatalogRepository(http).getPlan("ajedrez")).resolves.toBeNull();
  });

  it("propaga los demás errores de la API", async () => {
    const error = new AppError("NETWORK_ERROR", 0);
    const http = fakeAxios(jest.fn().mockRejectedValue(error));

    await expect(new HttpCatalogRepository(http).getPlan("boxeo")).rejects.toBe(error);
  });

  it.each(["../admin", "boxeo%2F..", "Boxeo", "boxeo/levels", ""])(
    "devuelve null sin llamar a la API si el slug no tiene el formato de la API (%p)",
    async (slug) => {
      const http = respondingWith(planResponse);

      await expect(new HttpCatalogRepository(http).getPlan(slug)).resolves.toBeNull();
      expect(http.get).not.toHaveBeenCalled();
    },
  );
});
