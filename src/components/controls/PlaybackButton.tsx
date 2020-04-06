import {CircleButton} from '../CircleButton';
import {Icon} from 'native-base';
import React, {useCallback, useMemo} from 'react';
import {TrackPlayerThunks} from '../../../lib/redux/track-player/thunks';
import {useDispatch} from 'react-redux';
import Book from '../../../model/Book';
import {useTypedSelector} from "../../../lib/redux";
import {PlayerState} from "../../../lib/track-player";

export const PlaybackButton: React.FC<{ book: Book }> = ({ book }) => {
  const dispatch = useDispatch();
  const playerState = useTypedSelector(state => state.trackPlayer);
  const activeBook = useMemo(() => playerState.activeBook != null && playerState.activeBook.id == book?.id, [playerState.activeBook, book]);
  console.log(activeBook);
  const loadBook = useCallback(() => dispatch(TrackPlayerThunks.loadBook(book, 0)), [book]);
  const toggle = useCallback(() => activeBook && dispatch(TrackPlayerThunks.toggle()), [book]);

  return (
    <CircleButton onPress={activeBook ? toggle : loadBook}>
      <Icon type="FontAwesome5" name={playerState.playbackState == PlayerState.Playing && activeBook ? 'pause' : 'play'} style={{ fontSize: 12 }} />
    </CircleButton>
  );
};
