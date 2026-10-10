import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { DemoTag, Icon, SectionHeader } from "./ui";
import { FIELD_LABELS, SCENARIOS, type FieldKey, type Tone } from "./simulatorData";

const AUTOPLAY_MS = 1900;

const toneClass: Record<Tone, string> = {
  neutral: "pill-neutral",
  warning: "pill-warning",
  jade: "pill-jade",
};

export function WorkflowSimulator() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS[scenarioIndex];
  const last = scenario.steps.length - 1;
  const current = scenario.steps[step];
  const atEnd = step === last;

  // Record and conversation as they stand at the current step
  const record = { ...scenario.record };
  scenario.steps.slice(0, step + 1).forEach((s) => Object.assign(record, s.record));
  const messages = scenario.steps.slice(0, step + 1).flatMap((s, i) => (s.messages ?? []).map((m, j) => ({ ...m, key: `${i}-${j}`, isNew: i === step })));

  useEffect(() => {
    if (!playing) return;
    if (atEnd) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((s) => s + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, step, atEnd]);

  // Keep the newest message in view inside the chat panel (without scrolling the page)
  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [step, scenarioIndex]);

  function selectScenario(i: number) {
    setScenarioIndex(i);
    setStep(0);
    setPlaying(false);
  }

  function onTabKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const keys: Record<string, number> = {
      ArrowRight: (i + 1) % SCENARIOS.length,
      ArrowDown: (i + 1) % SCENARIOS.length,
      ArrowLeft: (i - 1 + SCENARIOS.length) % SCENARIOS.length,
      ArrowUp: (i - 1 + SCENARIOS.length) % SCENARIOS.length,
      Home: 0,
      End: SCENARIOS.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = keys[e.key];
    selectScenario(next);
    tabRefs.current[next]?.focus();
  }

  function reset() {
    setStep(0);
    setPlaying(false);
  }

  return (
    <section id="simulator" aria-labelledby="simulator-title" className="section border-t border-line bg-white">
      <div className="container-x">
        <SectionHeader id="simulator-title" eyebrow="Interactive demo" title="See the system in action.">
          <p>Pick a situation, then step through what happens. Every name and message here is demonstration data.</p>
        </SectionHeader>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div role="tablist" aria-label="Scenarios" aria-orientation="vertical" className="grid content-start gap-2">
            {SCENARIOS.map((s, i) => {
              const selected = i === scenarioIndex;
              return (
                <button
                  key={s.id}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  role="tab"
                  id={`sim-tab-${s.id}`}
                  aria-selected={selected}
                  aria-controls="sim-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectScenario(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={`rounded-xl border px-4 py-3 text-left transition-colors lg:py-4 ${
                    selected ? "border-jade bg-tint/50" : "border-line bg-white hover:border-jade/60"
                  }`}
                >
                  <span className="font-mono text-[12px] text-muted">Scenario {i + 1}</span>
                  <span className="mt-1 block font-semibold leading-snug">{s.title}</span>
                </button>
              );
            })}
          </div>

          <div id="sim-panel" role="tabpanel" aria-labelledby={`sim-tab-${scenario.id}`} className="card panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
              <p className="font-display text-lg">{scenario.title}</p>
              <DemoTag />
            </div>

            <div className="grid md:grid-cols-[1fr_minmax(0,320px)]">
              {/* Conversation */}
              <div className="border-b border-line bg-surface md:border-b-0 md:border-r">
                <p className="flex items-center gap-2 px-5 pt-4 text-[13px] font-semibold text-muted sm:px-6">
                  <Icon name="chat" size={15} /> WhatsApp conversation
                </p>
                <div ref={chatRef} className="h-[300px] space-y-2.5 sm:h-[340px] overflow-y-auto px-5 py-4 sm:px-6" aria-label="Conversation" role="log">
                  {messages.map((m) =>
                    m.from === "system" ? (
                      <p key={m.key} className={`mx-auto w-fit rounded-full border border-line bg-white px-3 py-1 text-center font-mono text-[11px] text-muted ${m.isNew ? "anim-rise" : ""}`}>
                        {m.text}
                      </p>
                    ) : (
                      <div key={m.key} className={`flex ${m.from === "clinic" ? "justify-end" : "justify-start"} ${m.isNew ? "anim-rise" : ""}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-snug ${
                            m.from === "clinic" ? "rounded-br-md bg-tint" : "rounded-bl-md bg-white"
                          }`}
                        >
                          <span className="sr-only">{m.from === "clinic" ? "Clinic: " : "Patient: "}</span>
                          {m.text}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Workflow state */}
              <div className="flex flex-col p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[12px] text-muted">
                    Step {step + 1} of {scenario.steps.length}
                  </p>
                  <span key={`${scenario.id}-${step}`} className={`pill anim-pop ${toneClass[current.tone]}`}>{current.status}</span>
                </div>

                <ol className="mt-4 space-y-1">
                  {scenario.steps.map((s, i) => {
                    const done = i < step;
                    const now = i === step;
                    return (
                      <li key={s.label} className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors duration-300 ${
                            done ? "border-jade bg-jade text-white" : now ? "border-jade bg-white" : "border-line bg-white"
                          }`}
                          aria-hidden="true"
                        >
                          {done && <Icon name="check" size={11} strokeWidth={3} />}
                          {now && <span className="h-2 w-2 rounded-full bg-jade" />}
                        </span>
                        <span className={`text-[15px] leading-snug ${now ? "font-semibold text-deep" : done ? "text-deep" : "text-muted"}`}>
                          {s.label}
                          <span className="sr-only">{done ? " (done)" : now ? " (current step)" : ""}</span>
                        </span>
                      </li>
                    );
                  })}
                </ol>

                <p key={`d-${scenario.id}-${step}`} className="anim-fade mt-4 rounded-xl bg-surface p-3.5 text-[14px] leading-snug text-muted">
                  {current.detail}
                </p>

                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-line pt-4 text-[13px]">
                  {(Object.keys(FIELD_LABELS) as FieldKey[]).map((k) => (
                    <div key={k} className="contents">
                      <dt className="text-muted">{FIELD_LABELS[k]}</dt>
                      <dd className="text-right font-mono">{record[k]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-4 sm:px-6">
              <button type="button" className="btn btn-primary btn-sm" aria-disabled={atEnd} onClick={() => {
                if (atEnd) return;
                setPlaying(false);
                setStep((s) => Math.min(s + 1, last));
              }}>
                {atEnd ? "Workflow complete" : "Next step"} {!atEnd && <Icon name="next" size={16} />}
              </button>
              {!atEnd && (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPlaying((p) => !p)}>
                  <Icon name={playing ? "pause" : "play"} size={15} /> {playing ? "Pause" : "Play to the end"}
                </button>
              )}
              <button type="button" className="btn btn-secondary btn-sm" aria-disabled={step === 0} onClick={reset}>
                <Icon name="reset" size={15} /> Reset
              </button>
            </div>
            <p className="sr-only" aria-live="polite">
              Step {step + 1} of {scenario.steps.length}: {current.label}. {current.detail}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
