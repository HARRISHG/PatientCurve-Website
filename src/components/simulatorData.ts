export type Message = { from: "patient" | "clinic" | "system"; text: string };
export type Tone = "neutral" | "warning" | "jade";

export type SimStep = {
  label: string;
  detail: string;
  status: string;
  tone: Tone;
  messages?: Message[];
  /** Record fields that change at this step. */
  record?: Partial<Record<FieldKey, string>>;
};

export type FieldKey = "patient" | "reason" | "followUp" | "booking";

export type Scenario = {
  id: string;
  tab: string;
  title: string;
  record: Record<FieldKey, string>;
  steps: SimStep[];
};

export const FIELD_LABELS: Record<FieldKey, string> = {
  patient: "Patient",
  reason: "Reason",
  followUp: "Follow-up",
  booking: "Booking",
};

// All names, messages and times below are demonstration data.
export const SCENARIOS: Scenario[] = [
  {
    id: "not-booked",
    tab: "Enquiry not booked",
    title: "A patient enquires but doesn't book",
    record: { patient: "Priya (demo)", reason: "Teeth whitening", followUp: "—", booking: "Not booked" },
    steps: [
      {
        label: "New enquiry received",
        detail: "A patient asks about teeth whitening on the clinic's WhatsApp.",
        status: "New",
        tone: "neutral",
        messages: [{ from: "patient", text: "Hi, how much does teeth whitening cost?" }],
      },
      {
        label: "Enquiry recorded",
        detail: "The enquiry is captured with the service requested and where it came from, and the clinic's standard reply goes out.",
        status: "Captured",
        tone: "jade",
        messages: [
          { from: "clinic", text: "Thanks for asking! Whitening starts with a short consultation so the dentist can check what suits you. Would you like to book one?" },
        ],
        record: { followUp: "Waiting for reply" },
      },
      {
        label: "Follow-up scheduled",
        detail: "No reply and no booking. Following the clinic's rules, a follow-up goes out on the next working day.",
        status: "Follow-up sent",
        tone: "warning",
        messages: [
          { from: "system", text: "Next working day · follow-up 1" },
          { from: "clinic", text: "Hello Priya! Just checking in — would you like help arranging a whitening consultation?" },
        ],
        record: { followUp: "Follow-up 1 sent" },
      },
      {
        label: "Patient replies",
        detail: "The patient replies, so automated follow-ups stop and the conversation moves towards booking.",
        status: "Interested",
        tone: "jade",
        messages: [{ from: "patient", text: "Yes, Saturday morning if possible." }],
        record: { followUp: "Replied" },
      },
      {
        label: "Booking link offered / clinic team notified",
        detail: "The patient gets the booking link and the front desk is alerted to help. It's marked confirmed only once the appointment is actually booked.",
        status: "Booking requested",
        tone: "jade",
        messages: [
          { from: "clinic", text: "Great! You can pick a Saturday slot here: [booking link]. Our team will also confirm with you shortly." },
          { from: "system", text: "Front desk notified" },
        ],
        record: { followUp: "Complete", booking: "Booking requested" },
      },
    ],
  },
  {
    id: "reschedule",
    tab: "Needs to reschedule",
    title: "A patient needs to reschedule",
    record: { patient: "Rahul (demo)", reason: "Check-up", followUp: "—", booking: "Booked · Tue 11:00 am" },
    steps: [
      {
        label: "Reminder sent",
        detail: "The day before the appointment, the patient gets a reminder with an easy way to reschedule.",
        status: "Reminder sent",
        tone: "neutral",
        messages: [{ from: "clinic", text: "Hi Rahul, a reminder of your check-up tomorrow at 11:00 am. Reply 1 to confirm or 2 to reschedule." }],
        record: { followUp: "Reminder sent" },
      },
      {
        label: "Patient asks to reschedule",
        detail: "Instead of a missed appointment, the patient tells the clinic they can't make it.",
        status: "Needs a new time",
        tone: "warning",
        messages: [{ from: "patient", text: "2 — something came up at work." }],
        record: { booking: "Reschedule requested" },
      },
      {
        label: "Rescheduling options shared",
        detail: "The workflow shares the clinic's booking link or asks for a preferred day, whichever the clinic has chosen.",
        status: "Options shared",
        tone: "neutral",
        messages: [{ from: "clinic", text: "No problem. You can choose a new time here: [booking link] — or reply with a day that suits you." }],
      },
      {
        label: "New time requested",
        detail: "The patient suggests a new time.",
        status: "New time requested",
        tone: "jade",
        messages: [{ from: "patient", text: "Thursday after 5 pm works." }],
        record: { followUp: "Replied" },
      },
      {
        label: "Clinic team notified to confirm",
        detail: "The front desk confirms the new slot. If your calendar is connected and the patient books through the link, the booking can update automatically.",
        status: "Booking requested",
        tone: "jade",
        messages: [{ from: "system", text: "Front desk notified: Thursday after 5 pm" }],
        record: { followUp: "Complete", booking: "New slot requested" },
      },
    ],
  },
  {
    id: "due",
    tab: "Due for follow-up",
    title: "An existing patient is due for a follow-up",
    record: { patient: "Arjun (demo)", reason: "Routine check-up", followUp: "—", booking: "None upcoming" },
    steps: [
      {
        label: "Patient due for follow-up",
        detail: "Based on the clinic's recall rules, the patient shows up as due for a check-up.",
        status: "Due",
        tone: "warning",
        messages: [{ from: "system", text: "Due for check-up · last visit 7 months ago" }],
      },
      {
        label: "Eligibility checked",
        detail: "The workflow checks that the patient agreed to WhatsApp messages, hasn't opted out and has no appointment coming up.",
        status: "Eligible",
        tone: "neutral",
        messages: [{ from: "system", text: "Consent on file · no upcoming appointment" }],
      },
      {
        label: "Follow-up message sent",
        detail: "A friendly message goes out, worded the way the clinic approved.",
        status: "Message sent",
        tone: "neutral",
        messages: [{ from: "clinic", text: "Hi Arjun, it's been a while since your last check-up with us. Would you like to book one?" }],
        record: { followUp: "Message sent" },
      },
      {
        label: "Patient replies",
        detail: "The patient replies, so no further automated messages go out.",
        status: "Interested",
        tone: "jade",
        messages: [{ from: "patient", text: "Yes please, any evening next week." }],
        record: { followUp: "Replied" },
      },
      {
        label: "Booking link offered / clinic team notified",
        detail: "The patient gets the booking link and the front desk is alerted to confirm an evening slot.",
        status: "Booking requested",
        tone: "jade",
        messages: [
          { from: "clinic", text: "Here's the link to choose an evening slot: [booking link]. Our team will confirm with you." },
          { from: "system", text: "Front desk notified" },
        ],
        record: { followUp: "Complete", booking: "Booking requested" },
      },
    ],
  },
];
