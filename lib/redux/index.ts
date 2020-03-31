import { combineReducers } from 'redux';
import { trackPlayerReducer } from './track-player/reducer';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { TrackPlayerState } from './track-player/state';

export interface ApplicationState {
  trackPlayer: TrackPlayerState;
}

export const rootReducer = combineReducers({
  trackPlayer: trackPlayerReducer,
});

export const useTypedSelector: TypedUseSelectorHook<ApplicationState> = useSelector;
