import { Icon, SectionHeader, type IconName } from "./ui";

const COMPONENTS: { icon: IconName; title: string; text: string }[] = [
  { icon: "chat", title: "WhatsApp messaging", text: "Your clinic's WhatsApp number, with configured conversation flows and approved follow-up messages." },
  { icon: "calendar", title: "Your appointment calendar", text: "Your existing calendar or scheduling tool, where it can be connected — or a booking link your team already uses." },
  { icon: "inbox", title: "Your patient management system", text: "Where an integration is available, so follow-ups can use real appointment and visit data." },
  { icon: "flow", title: "Follow-up automation", text: "The rules that decide who gets a follow-up, when, and when to hand over to your team." },
  { icon: "chart", title: "Reporting", text: "A simple view of enquiry, follow-up and booking status, based on the data your systems provide." },
];

const FLOW: { icon: IconName; label: string; sub: string; brand?: boolean }[] = [
  { icon: "user", label: "Patient", sub: "Enquires or is due" },
  { icon: "chat", label: "WhatsApp", sub: "Conversation" },
  { icon: "flow", label: "Patientcurve workflow", sub: "Rules and next steps", brand: true },
  { icon: "calendar", label: "Calendar / clinic team", sub: "Booking or hand-off" },
  { icon: "chart", label: "Follow-up tracking", sub: "Status and outcomes" },
];

export function IntegrationDiagram() {
  return (
    <section id="integration" aria-labelledby="integration-title" className="section">
      <div className="container-x">
        <SectionHeader id="integration-title" eyebrow="Implementation" title="Works around your clinic's workflow.">
          <p>
            We don't ask you to replace what's working. Patientcurve is set up around the tools your clinic already uses,
            where they're compatible.
          </p>
        </SectionHeader>

        <figure className="card panel mt-12 p-5 sm:p-8">
          <figcaption className="label text-muted">How the pieces connect</figcaption>
          <ol className="mt-6 grid gap-3 lg:grid-cols-[repeat(5,minmax(0,1fr))] lg:gap-0">
            {FLOW.map((node, i) => (
              <li key={node.label} className="relative flex items-center gap-3 lg:flex-col lg:text-center">
                {i < FLOW.length - 1 && (
                  <>
                    <span aria-hidden="true" className="absolute left-6 top-12 h-[calc(100%-36px)] w-0.5 overflow-hidden bg-line lg:hidden" />
                    <span aria-hidden="true" className="flow-link absolute left-[calc(50%+32px)] right-[calc(-50%+32px)] top-6 hidden h-0.5 bg-line lg:block" />
                  </>
                )}
                <span
                  className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 ${
                    node.brand ? "border-jade bg-jade text-white" : "border-line bg-white text-jade"
                  }`}
                >
                  <Icon name={node.icon} size={20} />
                </span>
                <span className="lg:mt-3 lg:px-2">
                  <span className="block font-semibold leading-snug">{node.label}</span>
                  <span className="block text-[14px] text-muted">{node.sub}</span>
                </span>
              </li>
            ))}
          </ol>
        </figure>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPONENTS.map((c) => (
            <article key={c.title} className="card p-5">
              <Icon name={c.icon} size={22} className="text-jade" />
              <h3 className="mt-3 text-lg">{c.title}</h3>
              <p className="mt-1.5 text-[15px] text-muted">{c.text}</p>
            </article>
          ))}
          <article className="rounded-xl border border-dashed border-line p-5">
            <Icon name="search" size={22} className="text-muted" />
            <h3 className="mt-3 text-lg">What connects depends on you</h3>
            <p className="mt-1.5 text-[15px] text-muted">
              Integrations depend on your systems, access and plans. We check compatibility in the demo, before anything is
              set up — and tell you plainly if something can't be connected.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
