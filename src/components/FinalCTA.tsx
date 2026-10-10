import { useRef } from "react";
import { DEMO_HREF, whatsappLink } from "../lib/config";
import { useMounted, useSeenOnce } from "../lib/hooks";
import { Icon } from "./ui";

export function FinalCTA() {
  const ref = useRef<SVGSVGElement>(null);
  const mounted = useMounted();
  const seen = useSeenOnce(ref, 0.4);
  const wa = whatsappLink("Hi, I'd like to see how a patient follow-up workflow could fit my clinic.");

  return (
    <section aria-labelledby="final-title" className="pb-20 sm:pb-24">
      <div className="container-x">
        <div className="on-dark panel relative overflow-hidden bg-deep px-6 py-14 text-white sm:px-12 sm:py-20">
          <svg
            ref={ref}
            className="return-curve mb-8 h-auto w-[84px] sm:absolute sm:right-12 sm:top-1/2 sm:mb-0 sm:w-[200px] sm:-translate-y-1/2 lg:w-[260px]"
            viewBox="0 0 120 112"
            aria-hidden="true"
            data-on={mounted ? String(seen) : undefined}
          >
            <path d="M18 18 C22 92, 88 106, 96 44" fill="none" stroke="#3FC0A6" strokeWidth="12" strokeLinecap="round" />
            <circle cx="101" cy="18" r="10" fill="#F08AA0" />
          </svg>
          <div className="relative max-w-2xl">
            <h2 id="final-title" className="text-[2rem] leading-[1.1] sm:text-[2.75rem]">
              Don't let the next patient enquiry depend on someone remembering to follow up.
            </h2>
            <p className="mt-5 text-lg text-white/80">See how a structured patient follow-up workflow could fit your clinic.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={DEMO_HREF} className="btn bg-jade-light text-deep hover:bg-white">
                Book a free workflow demo <Icon name="arrow" size={18} />
              </a>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <Icon name="chat" size={18} /> Message us on WhatsApp
                </a>
              )}
            </div>
            <p className="mt-5 text-[15px] text-white/70">No obligation. We'll start with your current process.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
