import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/passport-photo/", label: "Passport Photo", external: true },
    { href: "/id-print/", label: "ID Card Print", external: true },
    { href: "/forms/", label: "Forms Hub", external: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">
        <Link href="/" className="flex-shrink-0">
          <span
            className="font-black text-xl tracking-tight select-none"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Studio <span style={{ color: "#F0A500" }}>Print.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location === l.href
                    ? "text-gray-900 bg-gray-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {l.label}
              </Link>
            )
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="/#pricing"
            className="hidden md:inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Pricing
          </a>
          <a
            href="/passport-photo/"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            style={{ background: "#F0A500", color: "#000" }}
          >
            Open a Tool ↗
          </a>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            )
          )}
          <div className="mt-2 pt-2 border-t border-gray-100">
            <a
              href="/#pricing"
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              Pricing
            </a>
            <a
              href="/passport-photo/"
              className="mt-1 block px-3 py-2.5 rounded-xl text-sm font-bold text-center transition-all duration-150"
              style={{ background: "#F0A500", color: "#000" }}
              onClick={() => setOpen(false)}
            >
              Open a Tool ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
