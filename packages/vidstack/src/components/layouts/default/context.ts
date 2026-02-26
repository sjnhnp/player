import { createContext, useContext, type ReadSignalRecord, type WriteSignal } from 'maverick.js';

import type { DefaultLayoutProps, Episode } from './props';

export interface DefaultLayoutContext extends ReadSignalRecord<DefaultLayoutProps> {
  menuPortal: WriteSignal<HTMLElement | null>;
  userPrefersAnnouncements: WriteSignal<boolean>;
  userPrefersKeyboardAnimations: WriteSignal<boolean>;
  isStatsVisible: WriteSignal<boolean>;
  episodes: WriteSignal<Episode[] | null>;
}

export const defaultLayoutContext = createContext<DefaultLayoutContext>();

export function useDefaultLayoutContext() {
  return useContext(defaultLayoutContext);
}
