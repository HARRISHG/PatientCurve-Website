import { useEffect, useState, type RefObject } from "react";

/** True when the visitor asked the OS to reduce motion. False during prerender. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** True while the element is on screen (and the tab is visible). */
export function useInView<T extends Element>(ref: RefObject<T | null>, threshold = 0.25): boolean {
  const [onScreen, setOnScreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setOnScreen(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  useEffect(() => {
    const update = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return onScreen && tabVisible;
}

/** Becomes true the first time the element scrolls into view, then stays true. */
export function useSeenOnce<T extends Element>(ref: RefObject<T | null>, threshold = 0.3): boolean {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, seen]);
  return seen;
}

/**
 * Steps through a timeline: holds step i for durations[i] ms, then moves on,
 * looping back to 0 after the last step. Only advances while `running`.
 * Starting on the last step lets an illustration show its outcome first.
 */
export function useTimeline(
  durations: number[],
  running: boolean,
  initialStep = 0,
): [number, (step: number) => void] {
  const [step, setStep] = useState(initialStep);
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % durations.length), durations[step]);
    return () => window.clearTimeout(id);
  }, [step, running, durations]);
  return [step, setStep];
}

/** False during prerender and the first client render, true after hydration. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
