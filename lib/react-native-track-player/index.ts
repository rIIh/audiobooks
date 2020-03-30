import TrackPlayer from 'react-native-track-player';

export function getState(state: TrackPlayer.State): PlayerState {
  switch (state) {
    default:
      return PlayerState.Undefined;
    case TrackPlayer.STATE_NONE:
      return PlayerState.None;
    case TrackPlayer.STATE_PLAYING:
      return PlayerState.Playing;
    case TrackPlayer.STATE_PAUSED:
      return PlayerState.Paused;
    case TrackPlayer.STATE_STOPPED:
      return PlayerState.Stopped;
    case TrackPlayer.STATE_BUFFERING:
      return PlayerState.Buffering;
    case TrackPlayer.STATE_READY:
      return PlayerState.Ready;
  }
}

export enum PlayerState {
  Undefined,
  None,
  Playing,
  Paused,
  Stopped,
  Buffering,
  Ready,
}
