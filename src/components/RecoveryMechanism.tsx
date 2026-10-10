import { useRef, useState, type ReactNode } from "react";
import { useInView, useMounted, usePrefersReducedMotion, useTimeline } from "../lib/hooks";
import { DemoTag, Icon, MotionToggle, SectionHeader, type IconName } from "./ui";

// Each card plays two phases: "before" then "after". The last phase holds the finished state.
const DURATIONS = [1500, 1700, 1500, 1700, 1500, 3200];
const LAST = DURATIONS.length - 1;

const REASONS: { icon: IconName; text: string }[] = [
  { icon: "flow", text: "Every eligible enquiry has a defined next step." },
  { icon: "clock", text: "Follow-ups happen according to rules you configure with us." },
  { icon: "chart", text: "Replies, booking status and staff hand-offs are tracked where integrations permit." },
];

export function RecoveryMechanism() {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, 0.25);
  const [paused, setPaused] = useState(false);
  const autoplay = mounted && !reduced;
  const [phase] = useTimeline(DURATIONS, autoplay && inView && !paused, LAST);

  const state = (i: number): CardState => (phase < 2 * i ? "waiting" : phase === 2 * i ? "before" : "after");
  const active = (i: number) => phase === 2 * i || phase === 2 * i + 1;
  const linkLit = (i: number) => phase >= 2 * i + 2;

  return (
    <section id="how-it-works" aria-labelledby="mechanism-title" className="section">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader id="mechanism-title" eyebrow="The mechanism" title="Meet the 3-Step Patient Recovery System.">
            <p>A practical workflow that connects enquiries to consistent follow-up.</p>
          </SectionHeader>
          <div className="flex items-center gap-2">
            <DemoTag>Sample data</DemoTag>
            {autoplay && <MotionToggle paused={paused} onToggle={() => setPaused((p) => !p)} label="the three-step animation" />}
          </div>
        </div>

        <div ref={ref} className="mt-14 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_32px_minmax(0,1fr)_32px_minmax(0,1fr)]">
          <StepCard n={1} name="Capture" title="Every enquiry gets a next step." active={active(0)} state={state(0)}
            text="Capture eligible patient enquiries and organise the details needed for follow-up.">
            <CaptureVisual state={state(0)} />
          </StepCard>
          <Link lit={linkLit(0)} />
          <StepCard n={2} name="Follow up" title="Keep the conversation moving." active={active(1)} state={state(1)}
            text="Configure timely WhatsApp follow-ups for eligible patients who haven't booked, with clear rules for replies, opt-outs and staff intervention.">
            <FollowUpVisual state={state(1)} />
          </StepCard>
          <Link lit={linkLit(1)} />
          <StepCard n={3} name="Recover" title="Guide interested patients back to booking." active={active(2)} state={state(2)}
            text="When a patient responds, guide them toward the next booking step — or notify your team when personal assistance is needed.">
            <RecoverVisual state={state(2)} />
          </StepCard>
        </div>

        <div className="mt-14 grid gap-4 border-t border-line pt-10 md:grid-cols-[220px_1fr_1fr_1fr] md:gap-6">
          <h3 className="text-xl">Why it works</h3>
          {REASONS.map((r) => (
            <p key={r.text} className="flex items-start gap-3 text-[16px]">
              <Icon name={r.icon} size={20} className="mt-0.5 shrink-0 text-jade" />
              {r.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

type CardState = "waiting" | "before" | "after";

function StepCard({ n, name, title, text, active, state, children }: {
  n: number; name: string; title: string; text: string; active: boolean; state: CardState; children: ReactNode;
}) {
  return (
    <article
      className={`card flex flex-col p-5 transition-colors duration-500 sm:p-6 ${active ? "border-jade" : ""}`}
      aria-label={`Step ${n}: ${name}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`grid h-9 w-9 place-items-center rounded-full font-mono text-[14px] transition-colors duration-500 ${
            state === "waiting" ? "bg-surface text-muted" : "bg-jade text-white"
          }`}
        >
          {n}
        </span>
        <span className="label text-jade">{name}</span>
      </div>
      <h3 className="mt-4 text-[1.4rem] leading-snug">{title}</h3>
      <p className="mt-2 text-[16px] text-muted">{text}</p>
      <div className={`mt-6 flex-1 rounded-2xl bg-surface p-4 transition-opacity duration-500 ${state === "waiting" ? "opacity-50" : ""}`} aria-hidden="true">
        {children}
      </div>
    </article>
  );
}

function Link({ lit }: { lit: boolean }) {
  return (
    <div aria-hidden="true" className="flex items-center justify-center py-2 lg:py-0">
      <span className="fill-line fill-line-v block h-8 w-0.5 bg-line lg:hidden" style={{ ["--fill" as string]: lit ? 1 : 0 }} />
      <span className="fill-line hidden h-0.5 w-full bg-line lg:block" style={{ ["--fill" as string]: lit ? 1 : 0 }} />
    </div>
  );
}

function Status({ state, before, after }: { state: CardState; before: string; after: string }) {
  const done = state === "after";
  return (
    <span className={`pill transition-colors duration-500 ${done ? "pill-jade" : "pill-warning"}`}>
      {done ? <Icon name="check" size={12} /> : <Icon name="pending" size={12} />}
      {done ? after : before}
    </span>
  );
}

function CaptureVisual({ state }: { state: CardState }) {
  const done = state === "after";
  const rows: [string, string, string][] = [
    ["Enquiry source", "WhatsApp", "WhatsApp"],
    ["Requested service", "—", "Teeth whitening"],
    ["Follow-up status", "—", "Next step set"],
    ["Booking status", "—", "Not booked yet"],
  ];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 rounded-xl border border-line bg-white px-3 py-2.5">
        <span className="flex min-w-0 items-center gap-2 text-[14px] font-semibold">
          <Icon name="chat" size={16} className="shrink-0 text-jade" />
          <span>New WhatsApp enquiry</span>
        </span>
        <Status state={state} before="New" after="Captured" />
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[13px]">
        {rows.map(([k, before, after]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd className={`text-right font-mono transition-colors duration-500 ${done ? "text-deep" : "text-muted"}`}>{done ? after : before}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function FollowUpVisual({ state }: { state: CardState }) {
  const done = state === "after";
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 rounded-xl border border-line bg-white px-3 py-2.5">
        <span className="flex min-w-0 items-center gap-2 text-[14px] font-semibold">
          <Icon name="clock" size={16} className="shrink-0 text-jade" />
          <span>Not booked yet</span>
        </span>
        <Status state={state} before="Pending follow-up" after="Message sent" />
      </div>
      <div className="step-item ml-auto max-w-[250px] rounded-2xl rounded-br-md bg-tint px-3.5 py-2.5" data-on={String(done)}>
        <p className="text-[14px] leading-snug">Hello! Would you like help arranging a consultation?</p>
        <p className="mt-1 text-right font-mono text-[11px] text-muted">Clinic · approved message</p>
      </div>
      <p className="mt-auto flex items-start gap-1.5 text-[12px] leading-snug text-muted">
        <Icon name="shield" size={14} className="mt-px shrink-0" />
        Sent only within your approved workflow, to patients who've agreed to messages. Opt-outs stop follow-ups.
      </p>
    </div>
  );
}

function RecoverVisual({ state }: { state: CardState }) {
  const done = state === "after";
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 rounded-xl border border-line bg-white px-3 py-2.5">
        <span className="flex min-w-0 items-center gap-2 text-[14px] font-semibold">
          <Icon name="reply" size={16} className="shrink-0 text-jade" />
          <span>Patient replied</span>
        </span>
        <Status state={state} before="Follow-up complete" after="Booking requested" />
      </div>
      <div className="max-w-[220px] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5">
        <p className="text-[14px] leading-snug">Yes, I'd like to book.</p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[13px] font-semibold">
        <span className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-2 transition-colors duration-500 ${done ? "border-jade bg-white text-jade" : "border-line text-muted"}`}>
          <Icon name="link" size={14} /> Booking link
        </span>
        <span className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-2 transition-colors duration-500 ${done ? "border-jade bg-white text-jade" : "border-line text-muted"}`}>
          <Icon name="bell" size={14} /> Team notified
        </span>
      </div>
      <p className="mt-auto text-[12px] leading-snug text-muted">
        Marked confirmed only when your booking system or team confirms the appointment.
      </p>
    </div>
  );
}
