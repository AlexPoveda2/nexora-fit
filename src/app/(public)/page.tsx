import { HealthStatus } from "@/features/health";

// Página temporal: muestra el estado de /api/v1/health para verificar el proxy (TF-4).
// Con HUF-3 pasa a ser la landing real. El <main> ya lo pone el layout de (public) (TF-8).
export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Nexora Fit</h1>
      <p className="mt-2">Esqueleto del frontend.</p>
      <HealthStatus />
    </div>
  );
}
