import {CircleButton} from '../CircleButton';
import {Icon} from 'native-base';
import React, {useCallback, useMemo} from 'react';
import Book from '../../../model/Book';
import {PlayerState} from "../../../lib/track-player";
import {Playback} from "../../unstate/Playback";

export const PlaybackButton: React.FC<{ book: Book }> = ({ book }) => {
  const { currentState: { book: currentBook }, dataSource: { state: playbackState }, methods: { toggle: _toggle, openBook } } = Playback.useContainer();
  const isActive = book && currentBook?.id == book.id;
  const loadBook = useCallback(() => openBook(book), [book, openBook]);
  const toggle = useCallback(() => {
    isActive && _toggle();
    console.log('Toggled', isActive, currentBook?.title, book.title);
  }, [book, _toggle, currentBook, book]);

  return (
    <CircleButton onPress={isActive ? toggle : loadBook} style={{ borderColor: isActive ? 'white' : undefined}}>
      <Icon type="FontAwesome5" name={playbackState == PlayerState.Playing && isActive ? 'pause' : 'play'} style={{ fontSize: 12, color: isActive ? 'white' : undefined }} />
    </CircleButton>
  );
};
