import { useRef, useState } from "react";
import { useInView, useMounted, usePrefersReducedMotion, useTimeline } from "../lib/hooks";
import { Icon, MotionToggle } from "./ui";

// How long each step is held (ms). One loop is about 13 seconds.
const DURATIONS = [1000, 1600, 800, 800, 2400, 1200, 1200, 1400, 2900];
const LAST = DURATIONS.length - 1;

const SCENES = [
  { label: "Enquiry", first: 0, last: 1 },
  { label: "Follow-up gap", first: 2, last: 4 },
  { label: "Patientcurve", first: 5, last: 7 },
  { label: "Next step", first: 8, last: 8 },
];

const WORKFLOW = [
  { step: 5, name: "Capture", status: "Enquiry recorded", icon: "inbox" as const },
  { step: 6, name: "Follow up", status: "Follow-up message scheduled", icon: "send" as const },
  { step: 7, name: "Recover", status: "Patient replies — interested in booking", icon: "reply" as const },
];

export function PatientJourneyAnimation() {
  const ref = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, 0.3);
  const [paused, setPaused] = useState(false);
  const autoplay = mounted && !reduced;
  const [step, setStep] = useTimeline(DURATIONS, autoplay && inView && !paused, LAST);
  const scene = SCENES.findIndex((s) => step >= s.first && step <= s.last);
  const on = (n: number) => String(step >= n);
  const withSystem = step >= 5;

  function showScene(i: number) {
    setPaused(true);
    setStep(SCENES[i].last);
  }

  return (
    <figure ref={ref} aria-labelledby="hero-visual-title" className="relative w-full">
      <div className="card panel p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p id="hero-visual-title" className="label text-muted">How an enquiry moves</p>
          <div className="flex items-center gap-1">
            <span className="demo-tag">Illustration</span>
            {autoplay && <MotionToggle paused={paused} onToggle={() => setPaused((p) => !p)} label="illustration" className="-mr-2" />}
          </div>
        </div>

        {/* Scene progress. Also lets visitors step through the story themselves. */}
        <ol className="mt-4 grid grid-cols-4 gap-2" aria-label="Scenes">
          {SCENES.map((s, i) => (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => showScene(i)}
                aria-current={i === scene ? "step" : undefined}
                className="group w-full rounded-md pt-1 text-left"
              >
                <span
                  className="fill-line block h-1 rounded-full bg-line"
                  style={{ ["--fill" as string]: i <= scene ? 1 : 0 }}
                />
                <span
                  className={`mt-1.5 block text-[12px] font-semibold leading-tight sm:text-[13px] ${
                    i === scene ? "text-deep" : "text-muted group-hover:text-deep"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="relative mt-5 h-[400px] sm:h-[380px]" aria-hidden="true">
          {/* Scenes 1–2: the enquiry and the manual follow-up gap */}
          <div
            className="absolute inset-0 flex flex-col transition-opacity duration-500"
            style={{ opacity: withSystem ? 0 : 1, visibility: withSystem ? "hidden" : "visible" }}
          >
            <div className="step-item flex items-end gap-2.5" data-on={on(0)}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tint text-jade">
                <Icon name="user" size={18} />
              </span>
              <div className="max-w-[300px] rounded-2xl rounded-bl-md bg-surface px-4 py-3">
                <p className="text-[15px] leading-snug">Hi, I'd like to know about teeth whitening.</p>
                <p className="mt-1 font-mono text-[11px] text-muted">Patient · WhatsApp</p>
              </div>
            </div>
            <div className="step-item mt-3 pl-11" data-on={on(1)}>
              <span className="pill pill-jade">
                <Icon name="inbox" size={13} /> New patient enquiry
              </span>
            </div>

            <div className="mt-7 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-2">
              <FlowChip on={on(2)} icon="chat" text="Enquiry received" />
              <Connector on={step >= 3} />
              <FlowChip on={on(3)} icon="users" text="Reception busy" />
              <Connector on={step >= 4} warn />
              <FlowChip on={on(4)} icon="pending" text="Follow-up pending" warn />
            </div>

            <div
              className="step-item mt-auto flex items-start gap-3 rounded-xl border border-warning/30 bg-warning-tint px-4 py-3 text-warning"
              data-on={on(4)}
            >
              <Icon name="clock" size={18} className="mt-0.5 shrink-0" />
              <p className="text-[15px] font-semibold leading-snug">Without a defined process, follow-ups can be missed.</p>
            </div>
          </div>

          {/* Scenes 3–4: Patientcurve runs the three steps, ending in a booking request */}
          <div
            className="absolute inset-0 flex flex-col transition-opacity duration-500"
            style={{ opacity: withSystem ? 1 : 0, visibility: withSystem ? "visible" : "hidden" }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="pill pill-deep">Patientcurve workflow</span>
              <span className="pill pill-neutral">Enquiry: teeth whitening</span>
            </div>
            <ol className="mt-4 space-y-3">
              {WORKFLOW.map((w, i) => {
                const reached = step >= w.step;
                return (
                  <li key={w.name} className="flex items-center gap-3">
                    <span className="relative shrink-0">
                      {i < WORKFLOW.length - 1 && (
                        <span
                          className="fill-line fill-line-v absolute left-[19px] top-10 h-[34px] w-0.5 bg-line"
                          style={{ ["--fill" as string]: step > w.step ? 1 : 0 }}
                        />
                      )}
                      <span
                        className={`relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 transition-colors duration-500 ${
                          reached ? "border-jade bg-jade text-white" : "border-line bg-white text-muted"
                        }`}
                      >
                        <Icon name={w.icon} size={18} />
                      </span>
                    </span>
                    <div
                      className={`flex-1 rounded-xl border px-3.5 py-2.5 transition-colors duration-500 ${
                        reached ? "border-jade/40 bg-tint/60" : "border-line bg-white"
                      }`}
                    >
                      <p className="label text-[12px] text-muted">
                        Step {i + 1} · {w.name}
                      </p>
                      <p className={`text-[15px] font-semibold leading-snug ${reached ? "text-deep" : "text-muted"}`}>
                        {reached ? w.status : "Waiting"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="step-item mt-auto rounded-2xl bg-deep p-4 text-white" data-on={on(8)}>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-jade-light text-deep">
                  <Icon name="calendar" size={18} />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-lg leading-tight">Appointment request received</p>
                  <p className="text-[14px] text-white/75">From enquiry to a clear next step.</p>
                </div>
                <span className="ml-auto hidden h-3 w-3 shrink-0 rounded-full bg-rose-light sm:block" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-[13px] text-muted">
        Conceptual illustration of how the workflow can run. Not a real patient, clinic or result.
      </figcaption>
      <div className="sr-only">
        <p>The illustration tells this story:</p>
        <ol>
          <li>A patient asks on WhatsApp about teeth whitening. It's a new patient enquiry.</li>
          <li>Reception is busy, so the follow-up stays pending. Without a defined process, follow-ups can be missed.</li>
          <li>With Patientcurve: the enquiry is recorded, a follow-up message is scheduled, and the patient replies that they're interested in booking.</li>
          <li>The clinic receives an appointment request: from enquiry to a clear next step.</li>
        </ol>
      </div>
    </figure>
  );
}

function FlowChip({ on, icon, text, warn = false }: { on: string; icon: "chat" | "users" | "pending"; text: string; warn?: boolean }) {
  return (
    <div
      className={`step-item flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-xl border px-2 py-3 text-center ${
        warn ? "border-warning/40 bg-warning-tint text-warning" : "border-line bg-white text-deep"
      }`}
      data-on={on}
    >
      <Icon name={icon} size={20} className={warn ? "" : "text-muted"} />
      <span className="text-[13px] font-semibold leading-tight sm:text-[14px]">{text}</span>
    </div>
  );
}

function Connector({ on, warn = false }: { on: boolean; warn?: boolean }) {
  return (
    <span
      className={`h-0.5 w-3 rounded-full transition-colors duration-500 sm:w-6 ${
        on ? (warn ? "bg-warning/60" : "bg-muted/60") : "bg-line opacity-0"
      }`}
    />
  );
}
