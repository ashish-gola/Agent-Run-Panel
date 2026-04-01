import PropTypes from "prop-types";
import TaskCard from "./TaskCard";

export default function TaskGroup({ tasks, title }) {
  return (
    <section className="rounded-2xl border border-[#ACBAC4]/25 bg-[#ACBAC4]/8 p-4 shadow-[0_12px_26px_rgba(17,24,39,0.25)] backdrop-blur-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-medium tracking-tight text-[#E8EEF3]">
          {title}
        </h2>
        <span className="rounded-full border border-[#E1D9BC]/35 bg-[#E1D9BC]/14 px-2 py-0.5 text-xs text-[#EDE4C8]">
          {tasks.length} tasks
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}

TaskGroup.propTypes = {
  title: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
  ).isRequired,
};