export function startMockRun(events, handleEvent) {
  let index = 0;

  function emitNext() {
    if (index >= events.length) return;

    const event = events[index];
    handleEvent(event);

    index += 1;

    // Simulate a streaming run with short randomized delays.
    const delay = 500 + Math.random() * 1000;
    setTimeout(emitNext, delay);
  }

  emitNext();
}
