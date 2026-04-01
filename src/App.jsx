import { useEffect } from "react";
import { useAgentRun } from "./state/useAgentRun.js";
import { startMockRun } from "./mock/emitter.js";
import events from "./mock/fixtures/run_success.json";

import TaskGroup from "./components/TaskGroup.jsx";
import ThoughtTimeline from "./components/ThoughtTimeline.jsx";
import ProgressBar from "./components/ProgressBar.jsx";

function App() {
  const { state, handleEvent } = useAgentRun();

  useEffect(() => {
    startMockRun(events, handleEvent);
  }, []);

  const tasks = Object.values(state.tasks);

  // 🔥 GROUPING LOGIC
  const grouped = {};

  tasks.forEach((task) => {
    const group = task.parallelGroup || "default";
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(task);
  });

  return (
    <div className="min-h-screen bg-[#30364F] text-[#F2F5F8]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-8 rounded-2xl border border-[#ACBAC4]/30 bg-linear-to-br from-[#ACBAC4]/18 to-[#ACBAC4]/8 p-6 shadow-[0_20px_40px_rgba(15,20,35,0.35)] backdrop-blur-md">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Agent Run Panel
          </h1>
          <p className="mt-1 text-sm text-[#DCE4EA]/85">
            AI agent orchestration dashboard
          </p>

          <div className="mt-5 grid gap-3 rounded-xl border border-[#E1D9BC]/35 bg-[#30364F]/50 p-4 text-sm sm:grid-cols-2">
            <div>
              <span className="text-[#C8D2DA]">Status:</span>{" "}
              <span className="font-medium text-[#EDE6CF]">{state.run.status}</span>
            </div>
            <div className="truncate">
              <span className="text-[#C8D2DA]">Query:</span>{" "}
              <span className="text-[#E7EDF2]">{state.run.query || "-"}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar tasks={tasks} />

        {/* Task Groups */}
        <div className="mt-8 space-y-7">
          {Object.entries(grouped).map(([group, groupTasks]) => (
            <TaskGroup
              key={group}
              title={`Group ${group}`}
              tasks={groupTasks}
            />
          ))}
        </div>

        {/* Thoughts */}
        <ThoughtTimeline thoughts={state.thoughts} />
      </div>
    </div>
  );
}

export default App;