import PropTypes from "prop-types";

export default function FinalOutputPanel({ finalOutput, runStatus }) {
  const summary = finalOutput?.summary;
  const citations = finalOutput?.citations || [];
  const hasOutput = Boolean(summary);
  let badgeLabel = "waiting";

  if (runStatus === "running") {
    badgeLabel = "still running";
  } else if (runStatus === "failed") {
    badgeLabel = "partial result";
  } else if (runStatus === "complete") {
    badgeLabel = "done";
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#262d3f] p-6 shadow-[0_12px_28px_rgba(8,12,22,0.28)] sm:p-7">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-[#AEBBC5]">Final result</div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            What came out of the run
          </h2>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#E8EEF3]">
          {badgeLabel}
        </span>
      </div>

      {hasOutput ? (
        <div className="space-y-4">
          <p className="max-w-4xl text-base leading-7 text-[#F5F8FA] sm:text-lg">
            {summary}
          </p>

          {citations.length > 0 ? (
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#AEBBC5]">
                Sources / notes
              </div>
              <div className="flex flex-wrap gap-2">
                {citations.map((citation, index) => (
                  <span
                    key={`${citation}-${index}`}
                    className="rounded-full border border-white/10 bg-[#30364F]/55 px-3 py-1.5 text-xs text-[#D8E1E8]"
                  >
                    {citation}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-[#30364F]/45 px-4 py-3 text-sm text-[#D8E1E8]">
              No notes were attached to this run.
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 bg-[#30364F]/45 px-4 py-5 text-sm text-[#D8E1E8]">
          {runStatus === "idle"
            ? "Start a run and the final result will show up here."
            : "The run is still building the final result from the task output."}
        </div>
      )}
    </section>
  );
}

FinalOutputPanel.propTypes = {
  finalOutput: PropTypes.shape({
    summary: PropTypes.string,
    citations: PropTypes.arrayOf(PropTypes.string),
  }),
  runStatus: PropTypes.string.isRequired,
};

FinalOutputPanel.defaultProps = {
  finalOutput: null,
};