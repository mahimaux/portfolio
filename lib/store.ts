"use client";
import { useSyncExternalStore } from "react";

type State = { entered: boolean; sound: boolean; menuOpen: boolean };
const initial: State = { entered: false, sound: false, menuOpen: false };
let state = initial;
const subs = new Set<() => void>();

export const store = {
  get: () => state,
  set(patch: Partial<State>) {
    state = { ...state, ...patch };
    subs.forEach((f) => f());
  },
  subscribe(f: () => void) {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
};

/** Run cb once the gate has been passed (immediately if already entered). Returns an unsubscribe. */
export function onEntered(cb: () => void) {
  if (state.entered) {
    cb();
    return () => {};
  }
  const off = store.subscribe(() => {
    if (state.entered) {
      off();
      cb();
    }
  });
  return off;
}

export function useStore() {
  return useSyncExternalStore(store.subscribe, store.get, () => initial);
}
