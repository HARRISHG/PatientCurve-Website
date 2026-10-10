import { DEMO_HREF } from "../lib/config";
import { NAV } from "./Header";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <img src="/assets/img/patientcurve-logo.svg" alt="Patientcurve" width={160} height={30} className="h-[30px] w-auto" />
          <p className="mt-4 text-[15px] text-muted">
            Patient journey automation for independent dental clinics in India. Structured WhatsApp follow-up for enquiries,
            appointments and returning patients.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="label text-muted">On this page</p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {NAV.map((n) => (
              <li key={n.href}><a href={n.href} className="hover:text-jade">{n.label}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="label text-muted">Get started</p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><a href={DEMO_HREF} className="hover:text-jade">Book a free workflow demo</a></li>
            <li><a href="#simulator" className="hover:text-jade">Try the workflow simulator</a></li>
            <li><a href="#integration" className="hover:text-jade">How it fits your systems</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col justify-between gap-2 py-6 text-[14px] text-muted sm:flex-row">
          <span>© 2026 Patientcurve. All rights reserved.</span>
          <span>Built for dental clinics.</span>
        </div>
      </div>
    </footer>
  );
}
