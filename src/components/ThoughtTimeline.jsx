import PropTypes from "prop-types";

import { useEffect, useRef } from "react";

function formatTime(timestamp) {
  if (!timestamp) return null;

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestamp));
}

export default function ThoughtTimeline({ thoughts }) {
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth",
    });
  }, [thoughts]);

  return (
    <section className="rounded-2xl border border-white/10 bg-[#262d3f] p-5 shadow-[0_12px_28px_rgba(8,12,22,0.24)] sm:p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.16em] text-[#AEBBC5]">Run log</div>
          <h2 className="mt-1 text-base font-medium tracking-tight text-white sm:text-lg">
            Thoughts
          </h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#E8EEF3]">
          auto scroll
        </span>
      </div>

      <div
        ref={ref}
        className="max-h-72 space-y-2 overflow-y-auto pr-1"
      >
        {thoughts.map((t) => (
          <div
            key={`${t.timestamp ?? "na"}-${t.task_id ?? "unknown"}-${t.thought}`}
            className="rounded-xl border border-white/10 bg-[#30364F]/55 p-3 text-sm leading-relaxed text-[#D8E1E8]"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#AEBBC5]">
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[#E8EEF3]">
                {t.task_id}
              </span>
              {formatTime(t.timestamp) ? <span>{formatTime(t.timestamp)}</span> : null}
            </div>
            <p className="leading-relaxed text-[#ECF1F5]">{t.thought}</p>
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