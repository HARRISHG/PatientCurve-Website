import { useRef } from "react";
import { useMounted, useSeenOnce } from "../lib/hooks";
import { Icon, SectionHeader, type IconName } from "./ui";

const JOURNEY: { title: string; text: string; icon: IconName; tone: "ok" | "warn" | "cold" }[] = [
  { title: "Enquiry arrives", text: "A patient asks about a treatment on WhatsApp or by phone.", icon: "chat", tone: "ok" },
  { title: "Conversation pauses", text: "The front desk is busy with patients in the clinic. The reply waits.", icon: "users", tone: "ok" },
  { title: "Follow-up gets delayed or missed", text: "Nobody has a reminder to check back, so the next step slips.", icon: "pending", tone: "warn" },
  { title: "Booking opportunity goes cold", text: "The patient compares options, gets busy, or books elsewhere.", icon: "clock", tone: "cold" },
];

const PROBLEMS: { title: string; text: string; icon: IconName }[] = [
  { title: "Unconverted enquiries", text: "Interested patients who never complete booking.", icon: "inbox" },
  { title: "Missed appointments", text: "Patients who need a reminder or a simple way to reschedule.", icon: "calendar" },
  { title: "Inactive patients", text: "Existing patients who may be due for a suitable follow-up.", icon: "user" },
];

const toneClass = {
  ok: "border-line bg-white text-jade",
  warn: "border-warning/40 bg-warning-tint text-warning",
  cold: "border-line bg-surface text-muted",
};

export function ProblemSection() {
  const ref = useRef<HTMLOListElement>(null);
  const mounted = useMounted();
  const seen = useSeenOnce(ref, 0.35);
  // Before hydration (and without JavaScript) every stage is shown.
  const show = String(!mounted || seen);

  return (
    <section id="problem" aria-labelledby="problem-title" className="section border-t border-line bg-white">
      <div className="container-x">
        <SectionHeader
          id="problem-title"
          eyebrow="The hidden problem"
          title="Your clinic may not need more enquiries. It may need a better follow-up system."
        >
          <p>
            Patients enquire, ask questions, compare options, get busy, and sometimes forget to book. When the next step
            depends entirely on manual follow-up, opportunities can slip through.
          </p>
        </SectionHeader>

        <ol ref={ref} className="relative mt-14 grid gap-6 md:grid-cols-4 md:gap-5" aria-label="How a booking opportunity goes cold">
          {/* Path behind the stages: horizontal on desktop, vertical on mobile */}
          <span aria-hidden="true" className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-line md:left-6 md:right-6 md:top-[23px] md:bottom-auto md:h-0.5 md:w-auto" />
          {JOURNEY.map((stage, i) => {
            return (
              <li
                key={stage.title}
                className="step-item relative flex gap-4 md:flex-col"
                data-on={show}
                style={{ transitionDelay: `${i * 380}ms` }}
              >
                <span className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 ${toneClass[stage.tone]}`}>
                  <Icon name={stage.icon} size={20} />
                </span>
                <div>
                  <p className="font-mono text-[12px] text-muted">0{i + 1}</p>
                  <h3 className={`text-xl leading-snug ${stage.tone === "cold" ? "text-muted" : ""}`}>{stage.title}</h3>
                  <p className="mt-1.5 text-[16px] text-muted">{stage.text}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-10 max-w-3xl text-[16px] text-muted">
          This isn't about anyone doing their job badly. Manual follow-up is hard to keep up when the clinic is busy — and
          the clinic is usually busy.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <article key={p.title} className="card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-tint text-jade">
                <Icon name={p.icon} size={20} />
              </span>
              <h3 className="mt-5 text-xl">{p.title}</h3>
              <p className="mt-2 text-muted">{p.text}</p>
            </article>
          ))}
        </div>

        <p className="mt-8 flex max-w-3xl items-start gap-3 rounded-xl border border-line bg-surface p-5 text-[16px]">
          <Icon name="search" size={20} className="mt-0.5 shrink-0 text-jade" />
          Your clinic may already handle some of these processes well. Patientcurve focuses on the gaps in your current
          workflow.
        </p>
      </div>
    </section>
  );
}
