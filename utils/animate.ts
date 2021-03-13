import { restrictRange } from './helper';

export function animate(from: number[], to: number[], duration: number, update, ease = x => x) {
  const state = {
    running: true,
    cb: null,
    frameId: 0,
    then(cb) {
      state.cb = cb;
    },
    cancel() {
      state.running = false;
      cancelAnimationFrame(state.frameId);
    },
  };

  const startT = performance.now();

  const step = now => {
    if (now - startT < duration && state.running) {
      state.frameId = requestAnimationFrame(step);
    } else {
      state.cb?.();
    }

    const p = restrictRange((now - startT) / duration, 0, 1);
    const curr = from.map((startV, k) => (to[k] - startV) * ease(p));
    update(curr);
  };

  step(startT);

  return state;
}
