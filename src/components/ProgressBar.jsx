import PropTypes from "prop-types";

export default function ProgressBar({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "complete").length;
  const running = tasks.filter((t) => t.status === "running").length;
  const failed = tasks.filter((t) => t.status === "failed").length;
  const cancelled = tasks.filter((t) => t.status === "cancelled").length;
  const finished = completed + failed + cancelled;

  const percent = total === 0 ? 0 : (finished / total) * 100;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#262d3f] p-5 shadow-[0_12px_28px_rgba(8,12,22,0.24)] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3 text-sm">
        <div>
          <div className="text-xs uppercase tracking-[0.16em] text-[#AEBBC5]">Progress</div>
          <span className="mt-1 block text-base font-medium text-white">Task progress</span>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#E8EEF3]">
          {Math.round(percent)}%
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-[#1f2533]">
        <div
          className="h-3 rounded-full bg-linear-to-r from-[#E1D9BC] to-[#f2ead1] transition-all duration-500 ease-in-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-4 grid gap-2 text-xs sm:grid-cols-4">
        <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[#D8E1E8]">Total {total}</span>
        <span className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-emerald-100">Done {completed}</span>
        <span className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-amber-100">Working {running}</span>
        <span className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-3 py-2 text-rose-100">Failed {failed}, stopped {cancelled}</span>
      </div>
    </div>
  );
}

ProgressBar.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string,
    }),
  ),
};

ProgressBar.defaultProps = {
  tasks: [],
};