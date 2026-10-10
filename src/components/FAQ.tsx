import { SectionHeader } from "./ui";

const FAQS: { q: string; a: string[] }[] = [
  {
    q: "We already use WhatsApp Business. Why would we need Patientcurve?",
    a: [
      "WhatsApp Business gives you the channel. It doesn't decide who needs a follow-up, when to send it, when to stop, or when to hand the conversation to your team — someone still has to remember.",
      "Patientcurve adds that workflow on top: defined next steps for each enquiry, follow-ups that run on rules you agree with us, and a clear view of what happened.",
    ],
  },
  {
    q: "How is this different from a chatbot?",
    a: [
      "A chatbot mainly answers questions in the moment. Patientcurve is set up as a complete follow-up workflow: it records the enquiry, follows up if the patient doesn't book, routes interested patients to booking or to your team, and tracks the status.",
      "Some chatbot tools offer parts of this too. The difference is that we design, set up and run the workflow with your clinic, rather than handing you a tool to configure.",
    ],
  },
  {
    q: "Does Patientcurve replace our clinic management software?",
    a: [
      "No. It works alongside your existing systems where they're compatible. Your clinic management software stays your record of patients and appointments.",
    ],
  },
  {
    q: "Can it work with our existing calendar?",
    a: [
      "Often, yes — but it depends on which calendar or scheduling tool you use and what access it allows. Where a direct connection isn't possible, we can use a booking link or notify your front desk to book the slot. We'll confirm what's possible during the demo.",
    ],
  },
  {
    q: "Can we customise follow-up messages?",
    a: [
      "Yes. You approve the wording, timing and number of follow-ups, and which patients they go to. Follow-ups outside an active conversation use WhatsApp-approved message templates and go only to patients who've agreed to receive messages. Patients can opt out at any time.",
    ],
  },
  {
    q: "How do you measure whether it is working?",
    a: [
      "We track the steps between enquiry and appointment: enquiries captured, follow-ups due and completed, replies and booking requests. Confirmed appointments and returning patients can be tracked when booking or visit data is available from your systems or your team.",
      "We'll agree with you up front what we'll measure, so you can judge the results for yourself.",
    ],
  },
  {
    q: "How long does setup take?",
    a: [
      "It depends on your current systems and how many workflows you start with. A simple enquiry follow-up workflow is quicker to set up than one that connects to your calendar and patient records. We'll give you a realistic timeline after the demo, once we've seen your setup.",
    ],
  },
  {
    q: "How much does it cost?",
    a: [
      "Pricing depends on the workflows you need, your number of locations and the integrations involved. The workflow demo is free, and you'll get a clear quote afterwards — no obligation.",
    ],
  },
];

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section border-t border-line bg-white">
      <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
        <SectionHeader id="faq-title" eyebrow="FAQ" title="Questions clinics ask us.">
          <p>Straight answers. Where something depends on your clinic, we say so.</p>
        </SectionHeader>
        <div className="divide-y divide-line border-y border-line">
          {FAQS.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[17px] font-semibold leading-snug [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-jade transition-transform duration-300 group-open:rotate-45">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </summary>
              <div className="space-y-3 pb-6 pr-12 text-muted">
                {f.a.map((p) => <p key={p}>{p}</p>)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
