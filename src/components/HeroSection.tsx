import { DEMO_HREF } from "../lib/config";
import { PatientJourneyAnimation } from "./PatientJourneyAnimation";
import { Icon } from "./ui";

// To test the alternative headline, switch HEADLINE to HEADLINES.b.
const HEADLINES = {
  a: "Every patient enquiry deserves a follow-up.",
  b: "Turn more dental enquiries into booked appointments.",
};
const HEADLINE = HEADLINES.a;

export function HeroSection() {
  return (
    <section id="top" aria-labelledby="hero-title" className="overflow-hidden pb-20 pt-10 sm:pt-14 lg:pb-28 lg:pt-20">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,540px)] lg:gap-16">
        <div className="max-w-xl">
          <p className="eyebrow">Patient journey automation for dental clinics</p>
          <h1 id="hero-title" className="mt-4 text-[2.5rem] leading-[1.05] sm:text-[3.25rem] lg:text-[3.75rem]">
            {HEADLINE}
          </h1>
          <p className="lead mt-6">
            Patientcurve helps dental clinics capture enquiries, follow up with patients who haven't booked, and reconnect
            with patients due for follow-up — through structured WhatsApp automation.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={DEMO_HREF} className="btn btn-primary">
              Book a free workflow demo <Icon name="arrow" size={18} />
            </a>
            <a href="#how-it-works" className="btn btn-secondary">
              See how it works
            </a>
          </div>
          <p className="mt-5 flex items-start gap-2 text-[15px] text-muted">
            <Icon name="check" size={18} className="mt-0.5 shrink-0 text-jade" />
            Built around your clinic's existing workflow. No need to replace your entire system.
          </p>
        </div>
        <PatientJourneyAnimation />
      </div>
    </section>
  );
}
