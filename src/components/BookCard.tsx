import React, {ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";
import Book from "../../model/Book";
import {useObservable} from "rxjs-hooks";
import {
  AsyncStorage,
  ImageBackground,
  ImageSourcePropType,
  Platform,
} from "react-native";
import {ActionSheet, Button, H1, Icon, Image, Text, Thumbnail, Toast} from "native-base";
import RNBackgroundDownloader, {DownloadTask} from 'react-native-background-downloader';
import styled from "styled-components/native";
import * as Progress from 'react-native-progress';
import {asyncForEach} from "../../lib/asyncForEach";
import RNFS from 'react-native-fs';
import useAsyncEffect from "use-async-effect";
import {useDownloads} from "./Downloads";
import {useActionSheet} from "./ActionSheet";
import RNTrackPlayer, {usePlaybackState} from 'react-native-track-player'
import TrackPlayer from "../../lib/TrackPlayer/TrackPlayer";
import Playlist from "../../lib/TrackPlayer/Playlist";
import {CircleButton} from "./CircleButton";

const Container = styled.View`
  margin: 24px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

const Thumb: React.FC<{ source: ImageSourcePropType }> = (props) => <ImageBackground
  source={{uri: 'https://via.placeholder.com/150'}}
  {...props}
  blurRadius={2}
  borderRadius={8}
  style={{
    aspectRatio: 9 / 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
  <Thumbnail source={{uri: 'https://via.placeholder.com/150'}} {...props} square style={{flex: 0}}/>
</ImageBackground>;

const Meta = styled.View`
  padding: 0 12px;
  align-self: stretch;
`;

const Right = styled.View`
  margin-left: auto;
`;

const Title = styled.Text`
  font-size: 18px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  font-weight: 100;
`;

enum State {
  Loading,
  NoCache,
  Ready,
  Playing,
  Paused,
  Downloading,
  DeletingCache,
  Destroying,
}

const ACTIVE_BOOK = 'active_book';

export const BookCard: React.FC<{ _book: Book }> = ({_book}) => {
  const book = useObservable(() => _book.observe());
  const chapters = useObservable(() => _book.chapters.observe());
  const links = useMemo(() => [...new Set(chapters?.map(chapter => chapter.downloadURL))], [chapters]);
  const downloads = useDownloads();
  const {show: showActionSheet} = useActionSheet();
  const playerState = usePlaybackState();

  const [progress, setProgress] = useState(0);

  const [state, setState] = useState(State.Loading);

  useAsyncEffect(async () => {
    console.log(playerState);
    if (!book) { return; }
    const activeBook = await AsyncStorage.getItem(ACTIVE_BOOK);
    if (activeBook == book.id) {
      let state: State = State.Ready;
      switch (playerState) {
        case RNTrackPlayer.STATE_PAUSED:
          state = State.Paused; break;
        case RNTrackPlayer.STATE_PLAYING:
          state = State.Playing; break;
        case RNTrackPlayer.STATE_STOPPED:
          state = State.Ready; break;
      }
      setState(state);
    }
  }, [playerState]);

  useAsyncEffect(async () => {
    if (!book || !chapters || state == State.Downloading) {
      return;
    }
    if (Platform.OS == "android") {
      try {
        const files = await RNFS.readDir(`${RNBackgroundDownloader.directories.documents}/${book.id}`);
        const taskIDs = links.map(link => JSON.stringify({book: book.id, chapter: link}));
        const tasks = taskIDs.map(id => downloads.pending.get(id)).filter((task): task is DownloadTask => task != undefined);
        if (files.length == links.length && tasks.length == 0) {
          setState(State.Ready);
        } else {
          setState(State.NoCache);
        }
      } catch (e) {
        console.warn(e);
      }
    }
  }, [book, chapters, state, downloads.pending]);

  useAsyncEffect(async () => {
    if (!book || !chapters || state == State.Downloading) {
      return;
    }
    const taskIDs = links.map(link => JSON.stringify({book: book.id, chapter: link}));
    const tasks = taskIDs.map(id => downloads.pending.get(id)).filter((task): task is DownloadTask => task != undefined);
    const remaining = links.length - tasks.length;
    if (tasks.length > 0) {
      Toast.show({
        text: 'Resuming download',
      });
      setState(State.Downloading);
      console.log('Resuming download');
      await asyncForEach(tasks, async (task, index) => {
        await new Promise((resolve, reject) => {
          task
            .progress(value => {
              setProgress((index + value) / remaining);
            })
            .done(resolve)
            .error(reject)
            .begin(() => Toast.show({
              text: `Download started: ${task.id}`,
            }))
            .resume();
        });
      });
      setState(State.Ready);
    }
  }, [book, chapters, downloads.pending]);

  const clearCache = async () => {
    if (!book || !chapters) {
      return;
    }
    setState(State.DeletingCache);
    const taskIDs = links.map(link => JSON.stringify({book: book.id, chapter: link}));
    const tasks = taskIDs.map(id => downloads.pending.get(id)).filter((task): task is DownloadTask => task != undefined);
    tasks.forEach(task => task.stop());
    try {
      switch (Platform.OS) {
        case "ios":
        case "android": {
          const files = await RNFS.readDir(`${RNBackgroundDownloader.directories.documents}/${book.id}`);
          await asyncForEach(files, async file => await RNFS.unlink(file.path));
          break;
        }
      }
    } catch (e) {
      console.warn(e);
    }
    Toast.show({
      text: 'Cache successfully cleared',
    });
    setState(State.NoCache);
  };

  const download = useCallback(async () => {
    if (!book || !chapters || state == State.Downloading) {
      return;
    }
    setState(State.Downloading);
    console.log('Download start', links);
    const tasks = links.map<[DownloadTask, string]>((link, index) => {
      const extension = link.slice(link.lastIndexOf('.')).length > 5 ? undefined : link.slice(link.lastIndexOf('.')).replace('\"', '');
      const config = {
        id: JSON.stringify({book: book.id, chapter: link}),
        url: link.replace(/^"|"$/g, ''),//.substring(1, file.length - 1),
        destination: `${RNBackgroundDownloader.directories.documents}/${book.id}/${index}${extension}`
      };
      const download = RNBackgroundDownloader.download(config);
      download.pause();
      return [download, link];
    });

    await asyncForEach(tasks, async ([task, link], index) => {
      try {
        const extension = link.slice(link.lastIndexOf('.')).length > 5 ? undefined : link.slice(link.lastIndexOf('.')).replace('\"', '');
        let fileExists = false;
        if (Platform.OS == "android") {
          try {
            const file = await RNFS.readFile(`${RNBackgroundDownloader.directories.documents}/${book.id}/${index}${extension}`);
            if (file.length > 0) {
              fileExists = true;
            }
          } catch (e) {
            console.warn(e);
          }
        }
        if (!fileExists) {
          await new Promise((resolve, reject) => {
            task
              .progress(value => {
                setProgress((index + value) / links.length);
              })
              .done(resolve)
              .error(reject)
              .begin(() => Toast.show({
                text: `Download started: ${task.id}`,
              }))
              .resume();
          });
        } else if (downloads.pending.get(task.id)) {
          const pendingTask = downloads.pending.get(task.id);
          task.stop();
          if (pendingTask) {
            await new Promise((resolve, reject) => {
              pendingTask
                .progress(value => {
                  setProgress((index + value) / links.length);
                })
                .done(resolve)
                .error(reject)
                .begin(() => Toast.show({
                  text: `Download started: ${task.id}`,
                }))
                .resume();
            });
          } else {
            console.log('File alredy exists')
          }
        }
      } catch (e) {
        console.warn(e);
        Toast.show({
          text: e,
          type: "danger",
        });
      }
    });
    setState(State.Ready);
  }, [book, chapters, progress]);

  const play = async () => {
    if (!book || !chapters || state !== State.Ready) {
      return;
    }
    try {
      switch (Platform.OS) {
        case "android": {
          const files = await RNFS.readDir(`${RNBackgroundDownloader.directories.documents}/${book.id}`);
          await Playlist.clearPlaylist();
          await Playlist.createPlaylistFrom({
            items: files.map(file => ({
              id: file.name,
              data: {
                id: file.name,
                title: file.name,
                artwork: '',
                url: file.path,
              }
            }))
          });
          await Playlist.togglePlay();
          break;
        }
      }
      await AsyncStorage.setItem(ACTIVE_BOOK, book.id);
    } finally {

    }
  };

  let PlayButton: ReactNode = <Progress.Circle size={40} indeterminate={true}/>;

  if (state == State.NoCache) {
    PlayButton = <CircleButton onPress={download}>
      <Icon type="FontAwesome5" name="arrow-down" style={{fontSize: 12}}/>
    </CircleButton>;
  } else if (state == State.Downloading) {
    PlayButton = <Progress.Circle size={40} progress={progress} indeterminate={false}/>
  } else if (state == State.Ready) {
    PlayButton = <CircleButton onPress={play}>
      <Icon type="FontAwesome5" name="play" style={{fontSize: 12}}/>
    </CircleButton>;
  } else if (state == State.DeletingCache) {
    PlayButton = <Progress.Circle size={40} indeterminate color="red">
      <Icon type="FontAwesome5" name="trash" style={{fontSize: 12}}/>
    </Progress.Circle>
  }

  return <Container>
    <Thumb source={{uri: book?.thumbnail}}/>
    <Meta>
      <Title>{book?.title ?? 'undefined'}</Title>
      <Subtitle>{book?.author}</Subtitle>
      <Subtitle>{chapters?.length}</Subtitle>
    </Meta>
    <Right style={{flexDirection: 'row',}}>
      {PlayButton}
      <Button dark transparent iconLeft onPress={() => {
        showActionSheet({
          actions: [
            {
              text: 'test',
              icon: 'save',
              callback: () => console.log('Test'),
            }
          ],
          destructive: [
            {
              text: 'Delete',
              icon: 'delete',
              callback: () => console.log('Deleted'),
            },
            {
              text: 'Clear Cache',
              icon: 'close',
              callback: clearCache,
            },
          ],

        });
      }} style={{
        justifyContent: 'center', alignItems: 'center', height: 40,
        width: 40
      }}>
        <Icon type="FontAwesome5" name="ellipsis-v" style={{fontSize: 12}}/>
      </Button>
    </Right>
  </Container>;
};
