import { Icon, SectionHeader } from "./ui";

const BASIC = ["Answers questions.", "Provides information.", "Helps with the initial conversation."];
const WORKFLOW = [
  "Captures the enquiry.",
  "Defines what happens next.",
  "Follows up according to configured rules.",
  "Connects to booking or staff workflows.",
  "Tracks follow-up and booking status where supported.",
];

export function ChatbotComparison() {
  return (
    <section id="difference" aria-labelledby="difference-title" className="section on-dark bg-deep text-white">
      <div className="container-x">
        <SectionHeader id="difference-title" eyebrow="The difference" title="Answering a question is only the beginning." />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <div className="panel border border-white/15 p-6 sm:p-8">
            <h3 className="text-xl text-white/80">Basic chatbot or AI assistant</h3>
            <ul className="mt-6 space-y-4">
              {BASIC.map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/75">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-white/15 pt-5 text-[15px] text-white/60">
              Useful — and then the conversation ends. What happens if the patient doesn't book?
            </p>
          </div>

          <div className="panel bg-white p-6 text-deep sm:p-8">
            <h3 className="text-xl">Patientcurve workflow</h3>
            <ul className="mt-6 space-y-4">
              {WORKFLOW.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-tint text-jade">
                    <Icon name="check" size={14} strokeWidth={2.6} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 max-w-3xl text-lg text-white/85">
          Patientcurve isn't about replacing every tool your clinic already uses. It's about connecting the gaps between
          patient conversations and the next action.
        </p>
        <p className="mt-4 max-w-3xl text-[15px] text-white/60">
          To be fair: many chatbot tools can also send follow-ups, connect to calendars or take bookings. The difference is
          that we set up and run the whole follow-up workflow with your clinic — the rules, the hand-offs to your team, and
          the tracking — instead of handing you another tool to configure.
        </p>
      </div>
    </section>
  );
}
