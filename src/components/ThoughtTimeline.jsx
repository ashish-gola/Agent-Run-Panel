import PropTypes from "prop-types";

import { useEffect, useRef } from "react";

export default function ThoughtTimeline({ thoughts }) {
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth",
    });
  }, [thoughts]);

  return (
    <section className="mt-8 rounded-2xl border border-[#ACBAC4]/28 bg-[#ACBAC4]/10 p-5 shadow-[0_12px_26px_rgba(15,20,35,0.28)] backdrop-blur-sm">
      <h2 className="mb-4 text-base font-medium tracking-tight text-[#EEF2F6]">
        Agent Thoughts
      </h2>

      <div
        ref={ref}
        className="max-h-64 space-y-2 overflow-y-auto pr-1"
      >
        {thoughts.map((t) => (
          <div
            key={`${t.timestamp ?? "na"}-${t.task_id ?? "unknown"}-${t.thought}`}
            className="rounded-xl border border-[#ACBAC4]/20 bg-[#30364F]/60 p-3 text-xs leading-relaxed text-[#D8E1E8] transition-all duration-300 hover:border-[#E1D9BC]/40 hover:bg-[#30364F]/72"
          >
            <span className="mr-1 text-[#E4DABF]">[{t.task_id}]</span>
            {t.thought}
          </div>
        ))}
      </div>
    </section>
  );
}

ThoughtTimeline.propTypes = {
  thoughts: PropTypes.arrayOf(
    PropTypes.shape({
      task_id: PropTypes.string,
      thought: PropTypes.string.isRequired,
      timestamp: PropTypes.number,
    }),
  ).isRequired,
};