import { DemoTag, Icon, SectionHeader } from "./ui";

// Sample values for the illustration only. They are not results from any clinic.
const METRICS = [
  { label: "New enquiries", value: 42, note: "Captured from WhatsApp" },
  { label: "Follow-ups due", value: 18, note: "Waiting on a next step" },
  { label: "Follow-ups completed", value: 15, note: "Sent, replied or closed" },
  { label: "Booking requests", value: 9, note: "Link used or team notified" },
  { label: "Confirmed appointments", value: 6, note: "Needs booking data", conditional: true },
  { label: "Patients reactivated", value: 4, note: "Needs visit data", conditional: true },
];
const MAX = Math.max(...METRICS.map((m) => m.value));

export function MeasurementDashboard() {
  return (
    <section id="measurement" aria-labelledby="measurement-title" className="section border-t border-line bg-white">
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeader id="measurement-title" eyebrow="Measurement" title="Know what happens after an enquiry.">
            <p>
              Track the process from enquiry to follow-up and appointment, so your team can see where opportunities are
              being lost.
            </p>
          </SectionHeader>
          <ul className="mt-8 space-y-3 text-[16px]">
            <li className="flex items-start gap-3">
              <Icon name="check" size={18} className="mt-1 shrink-0 text-jade" />
              See which enquiries still need a next step.
            </li>
            <li className="flex items-start gap-3">
              <Icon name="check" size={18} className="mt-1 shrink-0 text-jade" />
              Know how many follow-ups went out and how many patients replied.
            </li>
            <li className="flex items-start gap-3">
              <Icon name="check" size={18} className="mt-1 shrink-0 text-jade" />
              Spot where patients drop off, so you can fix the step that's leaking.
            </li>
          </ul>
          <p className="mt-8 text-[14px] text-muted">
            What can be reported depends on your clinic's data sources and setup. Confirmed appointments and reactivated
            patients, for example, need booking or visit data from your calendar, patient management system or team.
          </p>
        </div>

        <figure className="card panel overflow-hidden" aria-labelledby="dashboard-caption">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
            <p className="font-display text-lg">Follow-up overview</p>
            <DemoTag />
          </div>
          <dl className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
            {METRICS.map((m) => (
              <div key={m.label} className="bg-white p-4 sm:p-5">
                <dt className="text-[14px] font-semibold leading-snug text-muted">{m.label}</dt>
                <dd className="mt-2">
                  <span className="font-mono text-[1.75rem] leading-none text-deep">{m.value}</span>
                  <span className="mt-3 block h-1.5 rounded-full bg-surface" aria-hidden="true">
                    <span className="block h-full rounded-full bg-jade" style={{ width: `${(m.value / MAX) * 100}%` }} />
                  </span>
                  <span className={`mt-2 block text-[12px] leading-snug ${m.conditional ? "text-warning" : "text-muted"}`}>
                    {m.note}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <figcaption id="dashboard-caption" className="border-t border-line px-5 py-3 text-[13px] text-muted sm:px-6">
            Sample values for illustration. Not results from a real clinic.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
