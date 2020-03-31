import React, {ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import Book from "../../model/Book";
import {useObservable} from "rxjs-hooks";
import {ImageBackground, ImageSourcePropType, Platform,} from "react-native";
import {Button, Icon, Thumbnail, Toast, View} from "native-base";
import RNBackgroundDownloader, {DownloadTask} from 'react-native-background-downloader';
import styled from "styled-components/native";
import * as Progress from 'react-native-progress';
import {asyncForEach} from "../../lib/asyncForEach";
import RNFS from 'react-native-fs';
import useAsyncEffect from "use-async-effect";
import {useDownloads} from "./Downloads";
import {useActionSheet} from "./ActionSheet";
import {CircleButton} from "./CircleButton";
import {PlaybackButton} from "./controls/PlaybackButton";
import {useAsyncMemo} from "../../lib/hooks";
import prettyBytes from "pretty-bytes";
import {useDatabase} from "@nozbe/watermelondb/hooks";
import {prettyTime} from "../../lib/hmsParser";

const Container = styled.View`
  margin: 24px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

export const Thumb: React.FC<{ source: ImageSourcePropType, height?: number | string }> = ({ height, ...props }) => <ImageBackground
  source={{uri: 'https://via.placeholder.com/150'}}
  {...props}
  blurRadius={2}
  style={{
    aspectRatio: 9 / 14,
    alignItems: 'center',
    height: height ?? 100,
    overflow: 'hidden',
    borderRadius: 8,
    justifyContent: 'center'
  }}>
  <Thumbnail source={{uri: 'https://via.placeholder.com/150'}} {...props} resizeMode="contain" square style={{ width: '100%', height: '100%', overflow: 'hidden' }}/>
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

export const BookCard: React.FC<{ _book: Book }> = ({_book}) => {
  const book = useObservable(() => _book.observe());
  const chapters = useObservable(() => _book.chapters.observe());
  const database = useDatabase();
  const links = useMemo(() => [...new Set(chapters?.map(chapter => chapter.downloadURL))], [chapters]);
  const downloads = useDownloads();
  const {show: showActionSheet} = useActionSheet();
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<State>(State.Loading);
  const size = useAsyncMemo(async () => {
    if (!book) { return null; }
    try {
      if (Platform.OS == "android") {
        const files = await RNFS.readDir(`${RNBackgroundDownloader.directories.documents}/${book.id}`);
        return prettyBytes(files.map(file => parseInt(file.size)).reduce((acc, val) => acc + val));
      }
    } catch (e) {
      // Toast.show({
      //   text: 'Failed to get size of book',
      //   type: "danger",
      // })
    }
  }, [links], 'Calculating size');

  useAsyncEffect(async () => {
    if (!book) {
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
        setState(State.NoCache);
      }
    }
  }, [book, chapters]);

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

  const destroy = async () => {
    await clearCache();
    setState(State.Destroying);
    database.action(async () => {
      await asyncForEach(chapters ?? [], async chapter => {
        await chapter.destroyPermanently();
      });
      await book?.destroyPermanently();
    });
  };

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
              .error((error, errorCode) => {
                if (Platform.OS == "android") {
                  RNFS.unlink(`${RNBackgroundDownloader.directories.documents}/${book.id}/${index}${extension}`).then(() => {
                    reject({error, errorCode});
                  }).catch((unlinkFailed) => {
                    reject({error, errorCode, unlinkFailed});
                  });
                }
              })
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
        Toast.show({
          text: JSON.stringify(e),
          type: "danger",
        });
      }
    });
    setState(State.Ready);
  }, [book, chapters, progress]);

  const Control = ((state) => {
    switch (state) {
      case State.NoCache:
        return <CircleButton onPress={download}>
          <Icon type="FontAwesome5" name="arrow-down" style={{fontSize: 12}}/>
        </CircleButton>;
      case State.Loading:
        return <Progress.Circle size={40} progress={progress} indeterminate={false}/>;
      case State.DeletingCache:
        return <Progress.Circle size={40} indeterminate color="red">
          <Icon type="FontAwesome5" name="trash" style={{fontSize: 12}}/>
        </Progress.Circle>;
      case State.Destroying:
        return <Progress.Circle size={40} indeterminate color="red">
          <Icon type="FontAwesome5" name="close" style={{fontSize: 12}}/>
        </Progress.Circle>;
      case State.Downloading:
        return <Progress.Circle size={40} progress={progress} indeterminate={progress == 0}/>
      case State.Paused:
      case State.Playing:
      case State.Ready:
        return book && <PlaybackButton book={book}/>
    }
  })(state);

  const time = (chapters?.length ?? 0) > 0 && (chapters?.map(chapter => chapter.duration).reduce((acc, val) => acc + val ?? 0) ?? 0) || 0;

  return <Container>
    <Thumb source={{uri: book?.thumbnail}}/>
    <Meta>
      <Title>{book?.title ?? 'undefined'}</Title>
      <Subtitle>{book?.author}</Subtitle>
      <Subtitle>{size}</Subtitle>
      <Subtitle>{prettyTime(time)} | {chapters?.length} chapters</Subtitle>
    </Meta>
    <Right style={{flexDirection: 'row',}}>
      {Control}
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
              callback: destroy,
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
