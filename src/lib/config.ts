const rawWhatsApp = (import.meta.env.VITE_PATIENTCURVE_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

/** The business WhatsApp number, digits only, or null when not configured. */
export const WHATSAPP_NUMBER: string | null = rawWhatsApp.length >= 10 ? rawWhatsApp : null;

export function whatsappLink(message: string): string | null {
  if (!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Name the demo form is registered under in Netlify Forms. */
export const FORM_NAME = "workflow-demo";

export const DEMO_HREF = "#demo";
