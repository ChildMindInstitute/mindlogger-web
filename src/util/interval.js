const IDENTIFIERS = {};

let COUNTER = 0;

function _nextId() {
  return COUNTER += 1;
}

export function delayedExec(fn, options) {
  const dueDate = new Date();
  const timerId = _nextId();

  dueDate.setTime(dueDate.getTime() + (options.after || options.every));
  IDENTIFIERS[timerId] = setInterval(
    () => {
      const now = new Date();

      if (IDENTIFIERS[timerId] === undefined) {
        return;
      }
      if (now < dueDate) {
        return;
      }

      fn();
      if ('after' in options) {
        clearExec(timerId);
      } else {
        dueDate.setTime(now.getTime() + options.every);
      }
    },
    500, // One second.
  );

  return timerId;
}

export function clearExec(timerId) {
  clearInterval(IDENTIFIERS[timerId]);
  delete IDENTIFIERS[timerId];
}