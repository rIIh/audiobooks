import { createAction } from 'typesafe-actions';
import Book from '../../../model/Book';
import { PlayerState } from '../../react-native-track-player';

export const TrackPlayerActions = {
  setActiveBook: createAction('PLAY_BOOK')<Book>(),
  awaitForBook: createAction('AWAIT_BOOK')<void>(),
  setReady: createAction('PLAYER_READY')<void>(),
  resetBook: createAction('RESET')<void>(),
  setState: createAction('PLAYBACK_STATE')<PlayerState>(),
};
