import { useReducer } from "react";

/**
 * =========================
 * INITIAL STATE
 * =========================
 */
const initialState = {
  run: {
    status: "idle", // idle | running | complete | failed
    query: "",
    startTime: null,
  },
  tasks: {},
  thoughts: [],
  finalOutput: null,
};

/**
 * =========================
 * REDUCER
 * =========================
 */
function reducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    /**
     * RUN START
     */
    case "RUN_STARTED":
      return {
        ...state,
        run: {
          status: "running",
          query: payload.query,
          startTime: Date.now(),
        },
      };

    /**
     * TASK CREATED
     */
    case "TASK_SPAWNED":
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [payload.task_id]: {
            id: payload.task_id,
            label: payload.label,
            agent: payload.agent,
            status: "running",
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

    /**
     * TOOL CALL
     */
    case "TOOL_CALL": {
      const task = state.tasks[payload.task_id];
      if (!task) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [payload.task_id]: {
            ...task,
            toolCalls: [
              ...task.toolCalls,
              {
                tool: payload.tool,
                input: payload.input_summary,
                output: null,
              },
            ],
          },
        },
      };
    }

    /**
     * TOOL RESULT
     */
    case "TOOL_RESULT": {
      const task = state.tasks[payload.task_id];
      if (!task) return state;

      const updatedCalls = [...task.toolCalls];
      if (updatedCalls.length > 0) {
        updatedCalls.at(-1).output =
          payload.output_summary;
      }

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [payload.task_id]: {
            ...task,
            toolCalls: updatedCalls,
          },
        },
      };
    }

    /**
     * PARTIAL / FINAL OUTPUT
     */
    case "PARTIAL_OUTPUT": {
      const task = state.tasks[payload.task_id];
      if (!task) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [payload.task_id]: {
            ...task,
            outputs: [
              ...task.outputs,
              {
                content: payload.content,
                isFinal: payload.is_final,
                quality: payload.quality_score,
                timestamp: payload.timestamp,
              },
            ],
          },
        },
      };
    }

    /**
     * TASK STATUS UPDATE
     */
    case "TASK_UPDATE": {
      const prevTask = state.tasks[payload.task_id];
      if (!prevTask) return state;

      const isRetry =
        payload.status === "running" && prevTask.status === "failed";

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [payload.task_id]: {
            ...prevTask,
            status: payload.status,
            error: payload.error || null,
            message: payload.message || null,
            reason: payload.reason || null,
            retries: isRetry ? prevTask.retries + 1 : prevTask.retries,
          },
        },
      };
    }

    /**
     * AGENT THOUGHT
     */
    case "AGENT_THOUGHT":
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

    /**
     * RUN COMPLETE
     */
    case "RUN_COMPLETE":
      return {
        ...state,
        run: {
          ...state.run,
          status: "complete",
        },
        finalOutput: payload.output,
      };

    /**
     * RUN ERROR
     */
    case "RUN_ERROR":
      return {
        ...state,
        run: {
          ...state.run,
          status: "failed",
        },
      };

    default:
      return state;
  }
}

/**
 * =========================
 * HOOK
 * =========================
 */
export function useAgentRun() {
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * EVENT HANDLER (maps backend events → reducer actions)
   */
  const handleEvent = (event) => {
    switch (event.type) {
      case "run_started":
        dispatch({ type: "RUN_STARTED", payload: event });
        break;

      case "task_spawned":
        dispatch({ type: "TASK_SPAWNED", payload: event });
        break;

      case "tool_call":
        dispatch({ type: "TOOL_CALL", payload: event });
        break;

      case "tool_result":
        dispatch({ type: "TOOL_RESULT", payload: event });
        break;

      case "partial_output":
        dispatch({ type: "PARTIAL_OUTPUT", payload: event });
        break;

      case "task_update":
        dispatch({ type: "TASK_UPDATE", payload: event });
        break;

      case "agent_thought":
        dispatch({ type: "AGENT_THOUGHT", payload: event });
        break;

      case "run_complete":
        dispatch({ type: "RUN_COMPLETE", payload: event });
        break;

      case "run_error":
        dispatch({ type: "RUN_ERROR", payload: event });
        break;

      default:
        console.warn("Unknown event:", event);
    }
  };

  return {
    state,
    handleEvent,
  };
}