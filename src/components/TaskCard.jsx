import PropTypes from "prop-types";

export default function TaskCard({ task }) {
  const {
    label = "Untitled Task",
    agent = "unknown",
    status = "pending",
    toolCalls = [],
    outputs = [],
    error,
    startTime,
    endTime,
  } = task;

  const statusColor = {
    running: "bg-[#E1D9BC]/30 text-[#F3EBD1] border-[#E1D9BC]/60",
    complete: "bg-emerald-400/20 text-emerald-200 border-emerald-300/40",
    failed: "bg-rose-400/20 text-rose-200 border-rose-300/40",
  }[status] || "bg-[#ACBAC4]/25 text-[#E5EDF3] border-[#ACBAC4]/45";

  return (
    <article className="group rounded-2xl border border-[#ACBAC4]/25 bg-linear-to-br from-[#ACBAC4]/18 to-[#ACBAC4]/10 p-5 shadow-[0_12px_26px_rgba(15,20,35,0.28)] backdrop-blur-sm transition-all duration-400 ease-in-out hover:-translate-y-0.5 hover:scale-[1.01] hover:border-[#E1D9BC]/45 hover:shadow-[0_0_0_1px_rgba(225,217,188,0.15),0_18px_32px_rgba(18,24,36,0.4)]">

      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight text-[#F2F6FA] sm:text-lg">{label}</h2>

        <span className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wide ${statusColor}`}>
          {status}
        </span>
      </div>

      {/* Agent */}
      <div className="mb-4 text-sm text-[#D7E0E8]">
        <span className="text-[#B9C5CF]">Agent:</span> {agent}
      </div>

      {/* Tools */}
      {toolCalls.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-sm font-medium text-[#ECF1F5]">Tools</div>
          {toolCalls.map((call) => (
            <div
              key={`${call.tool || "tool"}-${call.input || "input"}-${call.output || "pending"}`}
              className="mb-1 rounded-lg border border-[#ACBAC4]/20 bg-[#30364F]/55 px-2.5 py-2 text-xs text-[#D8E1E8]"
            >
              <span className="text-[#E8DDBA]">{call.tool}</span> → {call.output || "processing..."}
            </div>
          ))}
        </div>
      )}

      {/* Outputs */}
      {outputs.length > 0 && (
        <div className="mb-2">
          <div className="mb-2 text-sm font-medium text-[#ECF1F5]">Output</div>
          {outputs.map((out) => (
            <div
              key={`${out.timestamp || "ts"}-${out.content || "content"}`}
              className="mt-1 rounded-lg border border-[#ACBAC4]/20 bg-[#30364F]/55 p-2.5 text-xs leading-relaxed text-[#D8E1E8]"
            >
              {out.content}
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {status === "failed" && (
        <div className="mt-3 rounded-lg border border-rose-300/35 bg-rose-400/12 px-2.5 py-2 text-xs text-rose-200">
          {error || "Task failed"}
        </div>
      )}

      {/* Time */}
      {startTime && endTime && (
        <div className="mt-3 text-xs text-[#BDCAD4]">
          Duration: {((endTime - startTime) / 1000).toFixed(2)}s
        </div>
      )}
    </article>
  );
}

TaskCard.propTypes = {
  task: PropTypes.shape({
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
    startTime: PropTypes.number,
    endTime: PropTypes.number,
  }).isRequired,
};