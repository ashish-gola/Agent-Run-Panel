import PropTypes from "prop-types";

const STATUS_META = {
  running: {
    label: "Running",
    className: "border-amber-300/40 bg-amber-300/15 text-amber-100",
  },
  complete: {
    label: "Complete",
    className: "border-emerald-300/45 bg-emerald-400/15 text-emerald-100",
  },
  failed: {
    label: "Failed",
    className: "border-rose-300/40 bg-rose-400/15 text-rose-100",
  },
  cancelled: {
    label: "Stopped Early",
    className: "border-slate-300/35 bg-slate-400/15 text-slate-100",
  },
};

function formatDuration(startedAt, endedAt, currentTime) {
  if (!startedAt) return null;

  const durationMs = Math.max((endedAt ?? currentTime) - startedAt, 0);
  if (!Number.isFinite(durationMs)) return null;

  if (durationMs < 1000) {
    return `${durationMs}ms`;
  }

  return `${(durationMs / 1000).toFixed(durationMs < 10000 ? 1 : 0)}s`;
}

export default function TaskCard({ task, currentTime }) {
  const {
    id: taskId,
    label = "Untitled Task",
    agent = "unknown",
    status = "pending",
    toolCalls = [],
    outputs = [],
    error,
    startedAt,
    endedAt,
    retries = 0,
    parallelGroup,
  } = task;

  const statusMeta =
    STATUS_META[status] || {
      label: status,
      className: "border-slate-300/30 bg-slate-400/15 text-slate-100",
    };

  const executionTime = formatDuration(startedAt, endedAt, currentTime);
  const recovered = retries > 0 && status === "complete";
  let executionLabel = "Pending";
  if (executionTime) {
    executionLabel = status === "running" ? `Running for ${executionTime}` : executionTime;
  }

  let retryLabel = "No retries";
  if (retries) {
    retryLabel = `${retries} recovery attempt${retries === 1 ? "" : "s"}`;
  }

  return (
    <article className="rounded-2xl border border-white/10 bg-[#262d3f] p-5 shadow-[0_12px_28px_rgba(8,12,22,0.24)]">

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#AEBBC5]">
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[#E8EEF3]">
              {taskId}
            </span>
            {parallelGroup ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[#D8E1E8]">
                group {parallelGroup}
              </span>
            ) : (
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[#D8E1E8]">
                single path
              </span>
            )}
          </div>

          <h2 className="mt-3 text-lg font-semibold tracking-tight text-white sm:text-xl">
            {label}
          </h2>
          <p className="mt-1 text-sm text-[#D9E3EA]">{agent}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] ${statusMeta.className}`}>
            {statusMeta.label}
          </span>
          {recovered ? (
            <span className="rounded-full border border-emerald-300/35 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-100">
              retried {retries} time{retries === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-[#30364F]/45 px-3 py-2.5">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#AEBBC5]">Time</div>
          <div className="mt-1 text-sm font-medium text-[#F5F1E3]">{executionLabel}</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#30364F]/45 px-3 py-2.5">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#AEBBC5]">Retries</div>
          <div className="mt-1 text-sm font-medium text-[#F5F1E3]">{retryLabel}</div>
        </div>
      </div>

      {toolCalls.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#AEBBC5]">
            Tools
          </div>

          <div className="space-y-2">
            {toolCalls.map((call, index) => (
              <div
                key={`${call.tool || "tool"}-${call.input || "input"}-${index}`}
                className="rounded-xl border border-white/10 bg-[#30364F]/45 p-3 text-sm text-[#D8E1E8]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-[#F0E7C5]">{call.tool || "tool"}</span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#A9B6C2]">#{index + 1}</span>
                </div>

                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-[#1F2538]/75 px-3 py-2">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#AEBBC5]">Input</div>
                    <p className="mt-1 text-sm leading-relaxed text-[#E9EEF4]">{call.input || "Processing input..."}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-[#1F2538]/75 px-3 py-2">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#AEBBC5]">Output</div>
                    <p className="mt-1 text-sm leading-relaxed text-[#E9EEF4]">{call.output || "Waiting for tool result..."}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {outputs.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#AEBBC5]">
            Outputs
          </div>

          <div className="space-y-2">
            {outputs.map((out, index) => (
              <div
                key={`${out.timestamp || "ts"}-${index}`}
                className={`rounded-xl border p-3 text-sm leading-relaxed ${
                  out.isFinal
                    ? "border-[#E1D9BC]/35 bg-[#E1D9BC]/10 text-[#FFF8E3] shadow-[0_0_0_1px_rgba(225,217,188,0.10)]"
                    : "border-dashed border-[#ACBAC4]/25 bg-[#30364F]/60 text-[#E5EDF3]"
                }`}
              >
                <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
                  <span className={out.isFinal ? "text-[#F3E9C6]" : "text-[#B9C5CF]"}>
                    {out.isFinal ? "final" : "update"}
                  </span>
                  {out.quality !== null && out.quality !== undefined ? (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-[#D8E1E8]">
                      Quality {Math.round(out.quality * 100)}%
                    </span>
                  ) : null}
                </div>
                {out.content}
              </div>
            ))}
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="mt-4 rounded-xl border border-rose-300/30 bg-rose-400/10 px-3 py-2.5 text-sm text-rose-100">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-200">Error</div>
          <p className="mt-1 leading-relaxed">{error || "Task failed"}</p>
        </div>
      )}
    </article>
  );
}

TaskCard.propTypes = {
  currentTime: PropTypes.number.isRequired,
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string,
    agent: PropTypes.string,
    status: PropTypes.string,
    toolCalls: PropTypes.arrayOf(
      PropTypes.shape({
        tool: PropTypes.string,
        input: PropTypes.string,
        output: PropTypes.string,
      }),
    ),
    outputs: PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string,
        timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
    ),
    error: PropTypes.string,
    startedAt: PropTypes.number,
    endedAt: PropTypes.number,
    retries: PropTypes.number,
    parallelGroup: PropTypes.string,
  }).isRequired,
};