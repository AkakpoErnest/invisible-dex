/**
 * User state (for Redux or similar).
 * See docs/ARCHITECTURE.md. Currently unused; add Redux when needed.
 */

export type UserState = {
  address: string | null;
  balance: string | null;
  channelId: string | null;
};

export const initialUserState: UserState = {
  address: null,
  balance: null,
  channelId: null,
};
