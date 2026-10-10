import { useEffect, useState } from "react";
import { DEMO_HREF } from "../lib/config";
import { Icon } from "./ui";

export const NAV = [
  { href: "#problem", label: "The problem" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#simulator", label: "See it in action" },
  { href: "#measurement", label: "Measurement" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <div className="container-x flex h-[68px] items-center justify-between gap-4">
        <a href="#top" className="shrink-0" onClick={() => setOpen(false)}>
          <img src="/assets/img/patientcurve-logo.svg" alt="Patientcurve home" width={160} height={30} className="h-[30px] w-auto" />
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="rounded-lg px-3 py-2 text-[15px] font-semibold text-muted hover:text-deep">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={DEMO_HREF} className="btn btn-primary btn-sm hidden sm:inline-flex">
            Book a free workflow demo
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label="Main (mobile)" hidden={!open} className="border-t border-line bg-surface lg:hidden">
        <ul className="container-x flex flex-col py-3">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-3 text-[17px] font-semibold">
                {item.label}
              </a>
            </li>
          ))}
          <li className="mt-2">
            <a href={DEMO_HREF} onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Book a free workflow demo
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
