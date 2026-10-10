import { useRef, useState, type FormEvent } from "react";
import { FORM_NAME, whatsappLink } from "../lib/config";
import { useMounted } from "../lib/hooks";
import { Icon, SectionHeader } from "./ui";

const LOCATIONS = ["1 location", "2–3 locations", "4 or more locations"];
const CHALLENGES = [
  "Enquiries don't consistently convert into bookings",
  "Missed appointments",
  "Patients don't return for follow-ups",
  "Reception team spends too much time on repetitive messaging",
  "Not sure yet",
];
const COVERED = [
  "How enquiries reach your clinic today, and what happens next",
  "How appointment reminders and rescheduling work",
  "Which patients should hear from you again, and when",
  "Where automation may help — and where it won't",
];

type Fields = { name: string; clinic: string; whatsapp: string; locations: string; challenge: string };
type FieldName = keyof Fields;
type Status = "idle" | "sending" | "success" | "error" | "demo";

const EMPTY: Fields = { name: "", clinic: "", whatsapp: "", locations: "", challenge: "" };
const ORDER: FieldName[] = ["name", "clinic", "whatsapp", "locations", "challenge"];

function validate(f: Fields): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  if (f.name.trim().length < 2) errors.name = "Please enter your name.";
  if (f.clinic.trim().length < 2) errors.clinic = "Please enter your clinic's name.";
  const digits = f.whatsapp.replace(/\D/g, "");
  if (!digits) errors.whatsapp = "Please enter your WhatsApp number.";
  else if (/[^\d\s+()-]/.test(f.whatsapp) || digits.length < 10 || digits.length > 13)
    errors.whatsapp = "Please enter a valid WhatsApp number, e.g. 98765 43210 or +91 98765 43210.";
  if (!f.locations) errors.locations = "Please choose how many locations your clinic has.";
  if (!f.challenge) errors.challenge = "Please choose your main challenge.";
  return errors;
}

/** Netlify Forms only works on the deployed site. Locally, nothing is sent. */
function isPreviewHost(): boolean {
  const { hostname, protocol } = window.location;
  return protocol === "file:" || hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

export function DemoBookingForm() {
  const mounted = useMounted();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const errors = validate(fields);
  const show = (k: FieldName) => (submitted || touched[k]) && errors[k];
  const wa = whatsappLink("Hi, I'd like to book a free workflow demo for my clinic.");

  function update(k: FieldName, v: string) {
    setFields((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    const firstError = ORDER.find((k) => errors[k]);
    if (firstError) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`);
      el?.focus();
      return;
    }
    const data = new FormData(e.currentTarget);
    const finish = (s: Status) => {
      setStatus(s);
      requestAnimationFrame(() => resultRef.current?.focus());
    };
    // Bots fill the hidden field; humans never see it.
    if (data.get("company_website")) return finish("success");
    if (isPreviewHost()) return finish("demo");

    setStatus("sending");
    try {
      const body = new URLSearchParams(data as unknown as Record<string, string>).toString();
      const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
      finish(res.ok ? "success" : "error");
    } catch {
      finish("error");
    }
  }

  const done = status === "success" || status === "demo";

  return (
    <section id="demo" aria-labelledby="demo-title" className="section">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_minmax(0,560px)] lg:gap-16">
        <div>
          <SectionHeader id="demo-title" eyebrow="Free patient follow-up workflow demo" title="Let's find the gaps in your clinic's patient follow-up.">
            <p>
              In a short workflow demo, we'll map how your clinic currently handles enquiries, appointment reminders and
              patient follow-ups — then show where automation may help.
            </p>
          </SectionHeader>
          <h3 className="mt-10 text-lg">What we'll cover</h3>
          <ul className="mt-4 space-y-3">
            {COVERED.map((c) => (
              <li key={c} className="flex items-start gap-3 text-[16px]">
                <Icon name="check" size={18} className="mt-1 shrink-0 text-jade" />
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[15px] text-muted">No obligation. We'll start with your current process.</p>
          {wa && (
            <p className="mt-4 text-[15px]">
              Prefer WhatsApp?{" "}
              <a href={wa} className="font-semibold text-jade underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                Message us directly
              </a>
              .
            </p>
          )}
        </div>

        <div className="card panel p-5 sm:p-8">
          {done ? (
            <div ref={resultRef} tabIndex={-1} role="status" className="outline-none">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-tint text-jade">
                <Icon name="check" size={24} strokeWidth={2.6} />
              </span>
              {status === "success" ? (
                <>
                  <h3 className="mt-5 text-2xl">Thanks — your request is in.</h3>
                  <p className="mt-3 text-muted">
                    We'll message you on WhatsApp to find a time for your workflow demo. It starts with a few questions about
                    how your clinic handles enquiries today.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="mt-5 text-2xl">Demo mode: nothing was sent.</h3>
                  <p className="mt-3 text-muted">
                    This preview isn't connected to the form service, so your details were not submitted. On the live site,
                    this form sends your request to the Patientcurve team.
                  </p>
                </>
              )}
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-6">
                  <Icon name="chat" size={18} /> Message us on WhatsApp
                </a>
              )}
              <button
                type="button"
                className="mt-6 block text-[15px] font-semibold text-jade underline underline-offset-4"
                onClick={() => {
                  setFields(EMPTY);
                  setTouched({});
                  setSubmitted(false);
                  setStatus("idle");
                }}
              >
                Send another request
              </button>
            </div>
          ) : (
            <form
              ref={formRef}
              name={FORM_NAME}
              method="POST"
              action="/thanks"
              data-netlify="true"
              netlify-honeypot="company_website"
              noValidate={mounted}
              onSubmit={onSubmit}
              aria-describedby="form-note"
            >
              <input type="hidden" name="form-name" value={FORM_NAME} />
              <p className="hidden">
                <label>
                  Don't fill this out if you're human: <input name="company_website" tabIndex={-1} autoComplete="off" />
                </label>
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                <TextField name="name" label="Your name" autoComplete="name" value={fields.name} error={show("name")}
                  onChange={(v) => update("name", v)} onBlur={() => setTouched((t) => ({ ...t, name: true }))} />
                <TextField name="clinic" label="Clinic name" autoComplete="organization" value={fields.clinic} error={show("clinic")}
                  onChange={(v) => update("clinic", v)} onBlur={() => setTouched((t) => ({ ...t, clinic: true }))} />
                <TextField name="whatsapp" label="WhatsApp number" type="tel" inputMode="tel" autoComplete="tel" value={fields.whatsapp}
                  error={show("whatsapp")} hint="We'll use this to arrange the demo."
                  onChange={(v) => update("whatsapp", v)} onBlur={() => setTouched((t) => ({ ...t, whatsapp: true }))} />
                <div>
                  <label htmlFor="f-locations" className="block text-[15px] font-semibold">Number of clinic locations</label>
                  <select
                    id="f-locations"
                    name="locations"
                    required
                    value={fields.locations}
                    onChange={(e) => update("locations", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, locations: true }))}
                    aria-invalid={show("locations") ? true : undefined}
                    aria-describedby={show("locations") ? "e-locations" : undefined}
                    className={inputClass(!!show("locations"))}
                  >
                    <option value="">Choose…</option>
                    {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {show("locations") && <FieldError id="e-locations">{errors.locations}</FieldError>}
                </div>
              </div>

              <fieldset className="mt-6" aria-describedby={show("challenge") ? "e-challenge" : undefined}>
                <legend className="text-[15px] font-semibold">Main challenge</legend>
                <div className="mt-3 grid gap-2">
                  {CHALLENGES.map((c, i) => (
                    <label
                      key={c}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-[15px] leading-snug transition-colors has-[:checked]:border-jade has-[:checked]:bg-tint/50 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-jade ${
                        show("challenge") ? "border-danger/60" : "border-line hover:border-jade/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="challenge"
                        value={c}
                        required={i === 0}
                        checked={fields.challenge === c}
                        onChange={() => update("challenge", c)}
                        className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-jade)]"
                      />
                      {c}
                    </label>
                  ))}
                </div>
                {show("challenge") && <FieldError id="e-challenge">{errors.challenge}</FieldError>}
              </fieldset>

              {status === "error" && (
                <div ref={resultRef} tabIndex={-1} role="alert" className="mt-6 rounded-xl border border-danger/40 bg-white p-4 text-[15px] outline-none">
                  <p className="font-semibold text-danger">Your request wasn't sent.</p>
                  <p className="mt-1 text-muted">
                    Something went wrong on our side or with the connection. Please try again
                    {wa ? (
                      <>
                        , or{" "}
                        <a href={wa} target="_blank" rel="noopener noreferrer" className="font-semibold text-jade underline underline-offset-4">
                          message us on WhatsApp
                        </a>
                        .
                      </>
                    ) : (
                      " in a moment."
                    )}
                  </p>
                </div>
              )}

              <button type="submit" className="btn btn-primary mt-7 w-full" aria-disabled={status === "sending"} disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Book my workflow demo"}
                {status !== "sending" && <Icon name="arrow" size={18} />}
              </button>
              <p id="form-note" className="mt-3 text-[13px] text-muted">
                We'll only use these details to arrange your demo. No obligation.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function inputClass(invalid: boolean) {
  return `mt-2 block min-h-12 w-full rounded-xl border bg-white px-3.5 py-2.5 text-[16px] text-deep outline-none transition-colors focus:border-jade focus-visible:outline-3 focus-visible:outline-jade/40 ${
    invalid ? "border-danger" : "border-line"
  }`;
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-[14px] text-danger">
      <Icon name="alert" size={15} className="mt-0.5 shrink-0" />
      {children}
    </p>
  );
}

function TextField(props: {
  name: FieldName;
  label: string;
  value: string;
  error: string | false | undefined;
  hint?: string;
  type?: string;
  inputMode?: "tel" | "text";
  autoComplete: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  const { name, label, value, error, hint, type = "text", inputMode, autoComplete, onChange, onBlur } = props;
  const describedBy = [hint && `h-${name}`, error && `e-${name}`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={`f-${name}`} className="block text-[15px] font-semibold">{label}</label>
      <input
        id={`f-${name}`}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={inputClass(!!error)}
      />
      {hint && <p id={`h-${name}`} className="mt-1.5 text-[13px] text-muted">{hint}</p>}
      {error && <FieldError id={`e-${name}`}>{error}</FieldError>}
    </div>
  );
}
