'use client';

import { useSyncExternalStore } from 'react';

/**
 * Active hero coffee as a tiny external store, so any component can follow
 * the slider without prop-drilling or re-rendering the whole hero.
 */
export interface JourneyState {
  slide: number;
  /** +1 = moving forward (Next), -1 = backwards (Prev). */
  direction: 1 | -1;
  /** Increments on every change so listeners can tell repeated values apart. */
  version: number;
}

let state: JourneyState = { slide: 0, direction: 1, version: 0 };
const listeners = new Set<() => void>();

export const journeyStore = {
  get: () => state,
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  goTo(slide: number, direction: 1 | -1) {
    if (slide === state.slide) return;
    state = { slide, direction, version: state.version + 1 };
    listeners.forEach((l) => l());
  },
  reset() {
    state = { slide: 0, direction: 1, version: 0 };
  },
};

const serverState: JourneyState = { slide: 0, direction: 1, version: 0 };

export function useJourneySlide() {
  return useSyncExternalStore(journeyStore.subscribe, journeyStore.get, () => serverState);
}
