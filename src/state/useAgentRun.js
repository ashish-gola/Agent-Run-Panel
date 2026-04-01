import { useReducer } from "react";

function getInitialState() {
  return {
    run: {
      status: "idle",
      query: "",
      startTime: null,
      endedAt: null,
    },
    tasks: {},
    thoughts: [],
    finalOutput: null,
  };
}

const terminalStatuses = new Set(["complete", "failed", "cancelled"]);

function updateTask(state, taskId, updater) {
  const task = state.tasks[taskId];
  if (!task) return state;

  return {
    ...state,
    tasks: {
      ...state.tasks,
      [taskId]: updater(task),
    },
  };
}

function handleResetRun() {
  return getInitialState();
}

function handleRunStarted(_, payload) {
  const startTime = payload.timestamp ?? Date.now();

  return {
    ...getInitialState(),
    run: {
      status: "running",
      query: payload.query,
      startTime,
      endedAt: null,
    },
  };
}

function handleTaskSpawned(state, payload) {
  const timestamp = payload.timestamp ?? Date.now();

  return {
    ...state,
    tasks: {
      ...state.tasks,
      [payload.task_id]: {
        id: payload.task_id,
        label: payload.label,
        agent: payload.agent,
        status: "running",
        startedAt: timestamp,
        endedAt: null,
        lastUpdatedAt: timestamp,
        toolCalls: [],
        outputs: [],
        dependencies: payload.depends_on || [],
        parallelGroup: payload.parallel_group || null,
        retries: 0,
        error: null,
        message: null,
      },
    },
  };
}

function handleToolCall(state, payload) {
  return updateTask(state, payload.task_id, (task) => ({
    ...task,
    lastUpdatedAt: payload.timestamp ?? Date.now(),
    toolCalls: [
      ...task.toolCalls,
      {
        tool: payload.tool,
        input: payload.input_summary,
        output: null,
      },
    ],
  }));
}

function handleToolResult(state, payload) {
  return updateTask(state, payload.task_id, (task) => {
    const updatedCalls = [...task.toolCalls];
    if (updatedCalls.length > 0) {
      updatedCalls.at(-1).output = payload.output_summary;
    }

    return {
      ...task,
      lastUpdatedAt: payload.timestamp ?? Date.now(),
      toolCalls: updatedCalls,
    };
  });
}

function handlePartialOutput(state, payload) {
  return updateTask(state, payload.task_id, (task) => ({
    ...task,
    lastUpdatedAt: payload.timestamp ?? Date.now(),
    outputs: [
      ...task.outputs,
      {
        content: payload.content,
        isFinal: payload.is_final,
        quality: payload.quality_score,
        timestamp: payload.timestamp,
      },
    ],
  }));
}

function handleTaskUpdate(state, payload) {
  return updateTask(state, payload.task_id, (task) => {
    const isRetry = payload.status === "running" && task.status === "failed";
    const nextTask = {
      ...task,
      status: payload.status,
      error: payload.error || null,
      message: payload.message || null,
      reason: payload.reason || null,
      retries: isRetry ? task.retries + 1 : task.retries,
      lastUpdatedAt: payload.timestamp ?? Date.now(),
    };

    if (payload.status === "running") {
      nextTask.startedAt = payload.timestamp ?? Date.now();
      nextTask.endedAt = null;
    }

    if (terminalStatuses.has(payload.status)) {
      nextTask.endedAt = payload.timestamp ?? Date.now();
    }

    return nextTask;
  });
}

function handleAgentThought(state, payload) {
  return {
    ...state,
    thoughts: [
      ...state.thoughts,
      {
        task_id: payload.task_id,
        thought: payload.thought,
        timestamp: payload.timestamp,
      },
    ],
  };
}

function handleRunComplete(state, payload) {
  return {
    ...state,
    run: {
      ...state.run,
      status: payload.status || "complete",
      endedAt: payload.timestamp ?? Date.now(),
    },
    finalOutput: payload.output || null,
  };
}

function handleRunError(state, payload) {
  return {
    ...state,
    run: {
      ...state.run,
      status: "failed",
      endedAt: payload.timestamp ?? Date.now(),
    },
  };
}

const actionHandlers = {
  RESET_RUN: handleResetRun,
  RUN_STARTED: handleRunStarted,
  TASK_SPAWNED: handleTaskSpawned,
  TOOL_CALL: handleToolCall,
  TOOL_RESULT: handleToolResult,
  PARTIAL_OUTPUT: handlePartialOutput,
  TASK_UPDATE: handleTaskUpdate,
  AGENT_THOUGHT: handleAgentThought,
  RUN_COMPLETE: handleRunComplete,
  RUN_ERROR: handleRunError,
};

function reducer(state, action) {
  const handler = actionHandlers[action.type];
  return handler ? handler(state, action.payload) : state;
}

export function useAgentRun() {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  const resetRun = () => {
    dispatch({ type: "RESET_RUN" });
  };

  const handleEvent = (event) => {
    const eventToAction = {
      run_started: "RUN_STARTED",
      task_spawned: "TASK_SPAWNED",
      tool_call: "TOOL_CALL",
      tool_result: "TOOL_RESULT",
      partial_output: "PARTIAL_OUTPUT",
      task_update: "TASK_UPDATE",
      agent_thought: "AGENT_THOUGHT",
      run_complete: "RUN_COMPLETE",
      run_error: "RUN_ERROR",
    }[event.type];

    if (!eventToAction) {
      console.warn("Unknown event:", event);
      return;
    }

    dispatch({ type: eventToAction, payload: event });
  };

  return {
    state,
    handleEvent,
    resetRun,
  };
}