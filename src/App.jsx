import { useEffect, useMemo, useRef, useState } from "react";
import { useAgentRun } from "./state/useAgentRun.js";
import { startMockRun } from "./mock/emitter.js";
import successEvents from "./mock/fixtures/run_success.json";
import errorEvents from "./mock/fixtures/run_error.json";

import TaskGroup from "./components/TaskGroup.jsx";
import ThoughtTimeline from "./components/ThoughtTimeline.jsx";
import ProgressBar from "./components/ProgressBar.jsx";
import FinalOutputPanel from "./components/FinalOutputPanel.jsx";
import EmptyState from "./components/EmptyState.jsx";

function formatElapsed(ms) {
  if (!Number.isFinite(ms) || ms < 0) return "00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function App() {
  const { state, handleEvent, resetRun } = useAgentRun();
  const activeRunRef = useRef(null);
  const [clock, setClock] = useState(Date.now());

  useEffect(() => {
    return () => {
      activeRunRef.current?.();
    };
  }, []);

  useEffect(() => {
    if (state.run.status !== "running") {
      setClock(Date.now());
      return undefined;
    }

    const timerId = setInterval(() => {
      setClock(Date.now());
    }, 1000);

    return () => clearInterval(timerId);
  }, [state.run.status, state.run.startTime]);

  const tasks = Object.values(state.tasks);

  const groupedTasks = useMemo(() => {
    return tasks.reduce((groups, task) => {
      const groupKey = task.parallelGroup || "sequential";

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push(task);
      return groups;
    }, {});
  }, [tasks]);

  const isIdle = state.run.status === "idle" && tasks.length === 0;
  let elapsedLabel = "00:00";
  if (state.run.startTime && state.run.status === "running") {
    elapsedLabel = formatElapsed(clock - state.run.startTime);
  } else if (state.run.startTime && state.run.endedAt) {
    elapsedLabel = formatElapsed(state.run.endedAt - state.run.startTime);
  }

  const launchRun = (events) => {
    activeRunRef.current?.();
    resetRun();
    setClock(Date.now());
    activeRunRef.current = startMockRun(events, handleEvent);
  };

  let statusBadge = "Idle";
  if (state.run.status === "running") {
    statusBadge = "running";
  } else if (state.run.status === "complete") {
    statusBadge = "done";
  } else if (state.run.status === "failed") {
    statusBadge = "failed";
  }

  return (
    <div className="min-h-screen bg-[#30364F] text-[#F2F5F8]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <header className="rounded-2xl border border-white/10 bg-[#2c3244]/92 p-6 shadow-[0_12px_28px_rgba(8,12,22,0.28)] backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[#D8E1E8]">
                  local mock panel
                </span>
                <span className="rounded-full border border-[#E1D9BC]/25 bg-[#E1D9BC]/10 px-3 py-1 text-xs font-medium text-[#F1E8C7]">
                  {statusBadge}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[3.4rem]">
                Agent run panel
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#D7E0E8] sm:text-base">
                I use this screen to replay a mock run, check how the tasks move, and see the final answer in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => launchRun(successEvents)}
                className="rounded-full border border-[#E1D9BC]/40 bg-[#E1D9BC] px-5 py-2.5 text-sm font-semibold text-[#30364F] transition-colors duration-200 hover:bg-[#EFE3B9]"
              >
                Load sample run
              </button>
              <button
                type="button"
                onClick={() => launchRun(errorEvents)}
                className="rounded-full border border-white/10 bg-[#273042] px-5 py-2.5 text-sm font-semibold text-[#F5F8FA] transition-colors duration-200 hover:border-white/20 hover:bg-[#30384d]"
              >
                Load error run
              </button>
            </div>
          </div>

          <p className="mt-5 text-xs leading-6 text-[#B9C5CF]">
            This is a local replay using the JSON fixtures in the project. Replace them with a live stream when you wire it up.
          </p>

          <div className="mt-6 grid gap-3 rounded-xl border border-white/10 bg-[#262d3f] p-4 text-sm sm:grid-cols-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#AEBBC5]">Status</div>
              <div className="mt-1 text-base font-medium text-white">{state.run.status}</div>
            </div>
            <div className="truncate">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#AEBBC5]">Prompt</div>
              <div className="mt-1 truncate text-base font-medium text-[#F5F8FA]">
                {state.run.query || "No query loaded"}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#AEBBC5]">Elapsed</div>
              <div className="mt-1 text-base font-medium text-[#F5F1E3]">{elapsedLabel}</div>
            </div>
          </div>
        </header>

        <div className="mt-8 space-y-8">
          {isIdle ? (
            <EmptyState
              onStartSuccess={() => launchRun(successEvents)}
              onStartError={() => launchRun(errorEvents)}
            />
          ) : (
            <>
              <FinalOutputPanel finalOutput={state.finalOutput} runStatus={state.run.status} />

              <ProgressBar tasks={tasks} />

              <div className="space-y-8">
                {Object.entries(groupedTasks).map(([group, groupTasks]) => (
                  <TaskGroup
                    key={group}
                    currentTime={clock}
                    isParallel={group !== "sequential"}
                    title={group === "sequential" ? "Sequential Tasks" : `Parallel Group: ${group}`}
                    tasks={groupTasks}
                  />
                ))}
              </div>

              <ThoughtTimeline thoughts={state.thoughts} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;