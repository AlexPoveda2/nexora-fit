import Link from "next/link";

// Siempre oscuro, sin importar el tema de la página (design system §2, §11.1).
// La cuenta de Instagram es provisional hasta que Sam la confirme (planeación front §8).
const LEGAL_LINKS = [
  { href: "/terminos", label: "Términos" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/reembolsos", label: "Reembolsos" },
  { href: "/aviso-salud", label: "Aviso de salud" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="dark border-border bg-background text-foreground border-t">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-sm sm:flex-row sm:justify-between">
        <a
          href="https://instagram.com/nexorafit"
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground"
        >
          Instagram
        </a>

        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <Link href="/acceder" className="hover:text-foreground">
            Ya tengo código
          </Link>
        </nav>

        <p>© {year} Nexora Fit</p>
      </div>
    </footer>
  );
}
