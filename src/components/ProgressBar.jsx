import PropTypes from "prop-types";

export default function ProgressBar({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "complete").length;
  const running = tasks.filter((t) => t.status === "running").length;
  const failed = tasks.filter((t) => t.status === "failed").length;

  const percent = total === 0 ? 0 : (completed / total) * 100;

  return (
    <div className="rounded-2xl border border-[#ACBAC4]/30 bg-[#ACBAC4]/12 p-5 shadow-[0_12px_30px_rgba(15,20,35,0.3)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_18px_35px_rgba(20,28,45,0.35)]">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-medium text-[#E9EEF3]">Run Progress</span>
        <span className="rounded-full border border-[#E1D9BC]/45 bg-[#E1D9BC]/18 px-2 py-0.5 text-xs font-medium text-[#F4ECD1]">
          {Math.round(percent)}%
        </span>
      </div>

      {/* Bar */}
      <div className="h-3 w-full overflow-hidden rounded-full bg-[#30364F]/85">
        <div
          className="h-3 rounded-full bg-linear-to-r from-[#E1D9BC]/90 to-[#E1D9BC] shadow-[0_0_22px_rgba(225,217,188,0.45)] transition-all duration-500 ease-in-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <span className="rounded-lg border border-[#ACBAC4]/20 bg-[#30364F]/45 px-2 py-1 text-[#D8E1E8]">Done: {completed}</span>
        <span className="rounded-lg border border-[#ACBAC4]/20 bg-[#30364F]/45 px-2 py-1 text-[#D8E1E8]">Running: {running}</span>
        <span className="rounded-lg border border-[#ACBAC4]/20 bg-[#30364F]/45 px-2 py-1 text-[#D8E1E8]">Failed: {failed}</span>
        <span className="rounded-lg border border-[#ACBAC4]/20 bg-[#30364F]/45 px-2 py-1 text-[#D8E1E8]">Total: {total}</span>
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