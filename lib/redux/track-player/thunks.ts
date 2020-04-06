import Book from '../../../model/Book';
import { ThunkAction } from 'redux-thunk';
import { ActionType } from 'typesafe-actions';
import { TrackPlayerActions } from './actions';
import { PlayerState } from '../../track-player';
import { ApplicationState } from '../index';

export const TrackPlayerThunks = {
  loadBook: (
    book: Book,
    chapter: number,
    autoPlay: boolean = true,
  ): ThunkAction<any, any, any, ActionType<typeof TrackPlayerActions>> => {
    return async dispatch => {
      dispatch(TrackPlayerActions.setActiveBook(book));
      if (autoPlay) {
        dispatch(TrackPlayerActions.setState(PlayerState.Playing));
      }
    };
  },
  dropBook: (): ThunkAction<any, any, any, ActionType<typeof TrackPlayerActions>> => {
    return async dispatch => {
      dispatch(TrackPlayerActions.resetBook());
    };
  },
  toggle: (): ThunkAction<any, ApplicationState, any, ActionType<typeof TrackPlayerActions>> => {
    return async (dispatch, getState) => {
      const currentState = getState().trackPlayer.playbackState;
      console.log('Toggling player');
      dispatch(
        TrackPlayerActions.setState(
          currentState == PlayerState.Playing
            ? PlayerState.Paused
            : currentState == PlayerState.Paused
            ? PlayerState.Playing
            : PlayerState.Stopped,
        ),
      );
    };
  },
};
