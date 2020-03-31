import { ActionType, createReducer } from 'typesafe-actions';
import { initialState, TrackPlayerState } from './state';
import { TrackPlayerActions } from './actions';

type Actions = ActionType<typeof TrackPlayerActions>;

export const trackPlayerReducer = createReducer<TrackPlayerState, Actions>(initialState).handleAction(
  TrackPlayerActions.setActiveBook,
  (state, { payload: book }) => {
    if (book.id === state.activeBook?.id || state.waitingForBook) { return state; }
    else {
      return { ...state, activeBook: book };
    }
  },
).handleAction(TrackPlayerActions.awaitForBook, state => {
  return { ...state, waitingForBook: true };
}).handleAction(TrackPlayerActions.setReady, state => {
  return { ...state, waitingForBook: false };
}).handleAction(TrackPlayerActions.resetBook, state => {
  return { ...state, activeBook: null, waitingForBook: false };
}).handleAction(TrackPlayerActions.setState, (state, action) => {
  return { ...state, playbackState: action.payload };
});
