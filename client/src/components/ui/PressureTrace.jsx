// src/components/ui/PressureTrace.jsx
//
// Signature visual motif: a live barometric-pressure-style trace line,
// evoking the seismograph/weather-instrument readouts this product is
// built around. Reused in the hero, as a section divider, and as a
// loading indicator so the "we are always monitoring" idea recurs
// throughout the product rather than living only on the landing page.
import { motion } from "framer-motion";

const PATH =
  "M0 60 L40 60 L55 30 L70 90 L85 20 L100 60 L160 60 L175 45 L190 75 L205 60 L260 60 L280 10 L300 100 L320 60 L400 60 L420 40 L440 60 L500 60 L520 35 L540 85 L560 60 L640 60 L660 25 L680 60 L760 60 L780 50 L800 60 L860 60";

export default function PressureTrace({ className = "", animate = true, color = "currentColor" }) {
  return (
    <svg
      viewBox="0 0 860 120"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d={PATH}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0.3 } : false}
        animate={animate ? { pathLength: 1, opacity: 1 } : false}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />
    </svg>
  );
}
