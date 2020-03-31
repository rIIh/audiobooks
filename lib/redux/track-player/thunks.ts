import Book from '../../../model/Book';
import { ThunkAction } from 'redux-thunk';
import { ActionType } from 'typesafe-actions';
import { Toast } from 'native-base';
import { TrackPlayerActions } from './actions';
import RNFS from 'react-native-fs';
import Playlist from '../../TrackPlayer/Playlist';
import RNBackgroundDownloader from 'react-native-background-downloader';
import { Platform } from 'react-native';

export const TrackPlayerThunks = {
  loadBook: (
    book: Book,
    autoPlay: boolean = true,
  ): ThunkAction<any, any, any, ActionType<typeof TrackPlayerActions>> => {
    return async dispatch => {
      dispatch(TrackPlayerActions.setActiveBook(book));
      dispatch(TrackPlayerActions.awaitForBook());
      if (Platform.OS === 'android') {
        try {
          const files = await RNFS.readDir(`${RNBackgroundDownloader.directories.documents}/${book.id}`);
          await Playlist.clearPlaylist();
          await Playlist.createPlaylistFrom({
            items: files.map(file => ({
              id: book.id + file.name,
              data: {
                id: book.id + file.name,
                title: book.title,
                artwork: '',
                url: file.path,
              },
            })),
          });
          if (autoPlay) {
            await Playlist.togglePlay();
          }
        } catch (e) {
          Toast.show({
            text: e.message,
            type: 'danger',
          });
        } finally {
          dispatch(TrackPlayerActions.setReady());
        }
      }
    };
  },
  dropBook: (): ThunkAction<any, any, any, ActionType<typeof TrackPlayerActions>> => {
    return async dispatch => {
      await Playlist.clearPlaylist();
      dispatch(TrackPlayerActions.resetBook());
    };
  },
  toggle: (): ThunkAction<any, any, any, ActionType<typeof TrackPlayerActions>> => {
    return async () => {
      await Playlist.togglePlay();
    };
  },
};
