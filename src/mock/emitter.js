export function startMockRun(events, handleEvent) {
  let index = 0;
  let timerId = null;
  let stopped = false;

  function emitNext() {
    if (stopped || index >= events.length) return;

    const event = events[index];
    handleEvent(event);

    index += 1;

    // Simulate a streaming run with short randomized delays.
    const delay = 500 + Math.random() * 1000;
    timerId = setTimeout(emitNext, delay);
  }

  emitNext();

  return () => {
    stopped = true;
    if (timerId) {
      clearTimeout(timerId);
    }
  };
}
