import PropTypes from "prop-types";
import TaskCard from "./TaskCard";

export default function TaskGroup({ tasks, title, isParallel, currentTime }) {
  let groupLabel = "single path";
  let groupDescription = "These tasks follow one after another.";

  if (isParallel) {
    groupLabel = "parallel";
    groupDescription = "These tasks are in the same parallel group.";
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#262d3f] p-5 shadow-[0_12px_28px_rgba(8,12,22,0.24)] backdrop-blur-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
              {title}
            </h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-[#D8E1E8]">
              {groupLabel}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#D8E1E8]">{groupDescription}</p>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#E8EEF3]">
          {tasks.length} task{tasks.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className={`grid gap-4 ${isParallel ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} currentTime={currentTime} />
        ))}
      </div>
    </section>
  );
}

TaskGroup.propTypes = {
  title: PropTypes.string.isRequired,
  isParallel: PropTypes.bool,
  currentTime: PropTypes.number.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
  ).isRequired,
};

TaskGroup.defaultProps = {
  isParallel: false,
};