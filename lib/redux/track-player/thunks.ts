import Book from '../../../model/Book';
import {ThunkAction} from 'redux-thunk';
import {ActionType} from 'typesafe-actions';
import {Toast} from 'native-base';
import {TrackPlayerActions} from './actions';
import RNFS from 'react-native-fs';
import Playlist from '../../TrackPlayer/Playlist';
import RNBackgroundDownloader from 'react-native-background-downloader';
import {Platform} from 'react-native';
import Chapter from "../../../model/Chapter";
import RNTrackPlayer from "react-native-track-player";
import {PlayerState} from "../../react-native-track-player";

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
          const chapters = await book.chapters.fetch();
          let chapterBefore: Chapter | null = null;
          let counter = 0;
          const durations = chapters.reduce<number[]>((durs, chapter) => {
            if (!chapterBefore) {
              chapterBefore = chapter;
              counter = chapter.duration;
              return durs;
            }
            else if (chapterBefore?.downloadURL == chapter.downloadURL) {
              counter += chapter.duration;
              chapterBefore = chapter;
              return durs;
            } else if (chapterBefore.downloadURL != chapter.downloadURL) {
              const result = counter;
              counter = chapter.duration;
              chapterBefore = chapter;
              return [...durs, result];
            } else if (chapter.id == chapters[chapters.length - 1].id) {
              return [...durs, counter + chapter.duration];
            } else {
              return [];
            }
          }, []);
          console.log(durations);
          await Playlist.clearPlaylist();
          await Playlist.createPlaylistFrom({
            items: files.map((file, index) => ({
              id: book.id + file.name,
              data: {
                id: book.id + file.name,
                title: book.title,
                // duration: durations[index],
                artwork: '',
                url: file.path,
              },
            })),
          });
          console.log((await RNTrackPlayer.getQueue()).map(track => track.duration));
          if (autoPlay) {
            // await Playlist.togglePlay();
            dispatch(TrackPlayerActions.setState(PlayerState.Playing));
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
