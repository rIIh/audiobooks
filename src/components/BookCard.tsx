import React, {useEffect, useMemo, useState} from "react";
import Book from "../../model/Book";
import {useObservable} from "rxjs-hooks";
import {ImageBackground, ImageSourcePropType, TouchableWithoutFeedback,} from "react-native";
import {Button, Icon, Thumbnail, Toast} from "native-base";
import RNBackgroundDownloader from 'react-native-background-downloader';
import styled from "styled-components/native";
import * as Progress from 'react-native-progress';
import {syncForEach} from "../../lib/asyncForEach";
import RNFS from 'react-native-fs';
import {useActionSheet} from "./ActionSheet";
import {CircleButton} from "./CircleButton";
import {useAsyncMemo} from "../../lib/hooks";
import {useDatabase} from "@nozbe/watermelondb/hooks";
import {prettyTime} from "../../lib/hmsParser";
import {Playback} from "../unstate/Playback";
import Downloads, {Failed} from "../unstate/Downloads";
import {combineLatest, noop} from "rxjs";
import sum from "../../lib/sum";
import {map, startWith} from "rxjs/operators";
import {useBookState} from "../state/BookState";
import {PlayerState} from "../../lib/track-player";
import FeatherIcon from "../../lib/feather1s-extended";
import {DownloadTask} from "../../lib/downloader";
import {Colors} from "../../lib/colors";
import { useHistory } from 'react-router-native';
import {TouchableNativeFeedback, TouchableOpacity} from "react-native-gesture-handler";

const Container = styled.View`
  margin: 16px;
  padding: 12px;
  flex-flow: row nowrap;
  align-items: center;
`;

export const Thumb: React.FC<{ source: ImageSourcePropType, height?: number | string, aspectRatio?: number }> =
  ({height, aspectRatio = 9 / 14, ...props}) => <ImageBackground
  source={{uri: 'https://via.placeholder.com/150'}}
  {...props}
  blurRadius={2}
  style={{
    aspectRatio: aspectRatio,
    alignItems: 'center',
    height: height ?? 100,
    overflow: 'hidden',
    borderRadius: 8,
    justifyContent: 'center'
  }}>
  <Thumbnail source={{uri: 'https://via.placeholder.com/150'}} {...props} resizeMode="contain" square style={{width: '100%', height: '100%', overflow: 'hidden'}}/>
</ImageBackground>;

const Meta = styled.View`
  padding: 0 12px;
  justify-content: center;
  overflow: hidden;
  flex: 1;
`;

const Right = styled.View`
  margin-left: auto;
`;

const InvertibleText = styled.Text<{ inverted?: boolean, dark?: string, light?: string }>`
  color: ${props => props.inverted ? (props.dark ?? 'white') : (props.light ?? 'black')};
  margin-bottom: 4px;
`;

const Title = styled(InvertibleText)`
  font-size: 16px;
`;

// @ts-ignore
const Subtitle = styled(InvertibleText).attrs<{ dark?: string, light?: string }>(props => {
  props.light = 'grey';
  props.dark = '#efefef';
})`
  font-size: 12px;
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

export const BookCard: React.FC<{ _book: Book }> = ({_book: bookRef}) => {
  const book = useObservable(() => bookRef.observe());
  const chapters = useObservable(() => bookRef.chapters.observe());
  const links = useMemo(() => [...new Set(chapters?.map(chapter => chapter.downloadURL.replace(/^"|"$/g, '')))], [chapters]);
  const downloads = Downloads.useContainer();
  const tasks = useMemo(() => [...downloads.tasks.filter((task, url) => links.includes(url)).values()], [links, downloads.tasks]);
  const files = useObservable(() => bookRef.files.observe());
  const wholeSize = (files && files.length > 0) ? files.map(file => file.remoteSize ?? 0).reduce(sum) : 0;
  const { currentState: { book: currentBook }, dataSource: { state: playbackState }, methods: { toggle: _toggle, openBook } } = Playback.useContainer();
  const readyFiles = useAsyncMemo(async () => {
    if (!files) { return []; }
    try {
      const storagePath = RNBackgroundDownloader.directories.documents;
      const filesAtSD = await RNFS.readDir(`${storagePath}/${book?.id}`);
      return filesAtSD.filter(file => files.find(_file => file.path.includes(_file.path))?.remoteSize?.toString() == file.size);
    } catch (e) {
      return [];
    }
  }, [tasks, files], []);
  const isActive = book != null && currentBook?.id == book.id;

  const { stateType, state, transit, stateChanged } = useBookState({
    Loading: {
      awake: async () => {
        if (!book || !files) { return; }
        let cancelled = false;
        stateChanged.toPromise().then(() => cancelled = true);
        const pendingTasks = [...downloads.tasks.filter((task, url) => links.includes(url)).values()];
        if (pendingTasks.length > 0 && !cancelled) { transit("Downloading"); return; }
        if (isActive) {
          transit("Playing");
          return;
        }
        try {
          console.log('Searching files');
          const storagePath = RNBackgroundDownloader.directories.documents;
          const filesAtSD = await RNFS.readDir(`${storagePath}/${book?.id}`);
          if (cancelled) { return; }
          if (filesAtSD.length == files?.length && filesAtSD.every(file => files.find(_file => file.path.includes(_file.path))?.remoteSize?.toString() == file.size)) {
            transit("Ready");
            return;
          } else {
            transit("NoCache");
          }
        } catch (e) {
          transit("NoCache");
        }
      }
    },
    NoCache: {
      download: async () => {
        if (!book || !files) {
          return;
        }
        transit("Downloading");
        const responses: (DownloadTask | Failed | undefined)[] = [];
        for (let file of files) {
          responses.push(await downloads.push(file.url, {
            path: file.path, payload: {
              bookID: book.id,
            },
          }));
        }
        console.log(responses);
        const failed = responses.find(response => response != null && response in Failed) as Failed;
        if (failed) {
          console.warn(failed);
          Toast.show({
            type: "danger",
            text: failed,
          })
        }
      }
    },
    Ready: {
      load: () => transit("Playing"),
      clear: () => clearCache(),
    },
    Downloading: {
      clear: () => clearCache(),
    },
    Playing: {
      awake: () => { book && openBook(book); },
      toggle: () => _toggle(),
      clear: () => clearCache(),
    },
    Clearing: {

    },
    Destroying: {

    },
  }, "Loading");
  useEffect(() => transit("Loading"), [files, tasks]);
  useEffect(() => { !isActive && stateType == "Playing" && transit("Ready"); }, [isActive]);

  const progressSource = useMemo(() => tasks.length > 0 ? combineLatest(tasks.map(task => task.State.pipe(map(value => value.percent)).pipe(startWith(0)))) : null, [tasks]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const subscription = progressSource?.subscribe(values => {
      if (tasks.length > 0) {
        setProgress((values.reduce(sum) + readyFiles.length) / (files?.length ?? 1));
      } else {
        progress != 0 && setProgress(0);
      }
    }, noop);
    return () => {
      subscription?.closed || subscription?.unsubscribe();
    }
  }, [tasks]);

  const database = useDatabase();
  const {show: showActionSheet} = useActionSheet();

  const destroy = async () => {
    await clearCache();
    database.action(async () => {
      await syncForEach(chapters ?? [], async chapter => {
        await chapter.destroyPermanently();
      });
      await book?.destroyPermanently();
    });
  };

  const clearCache = async () => {
    if (!book || !chapters) {
      return;
    }
    transit("Clearing");
    tasks.forEach(task => task.stop());
    try {
      const storagePath = RNBackgroundDownloader.directories.documents;
      const files = await RNFS.readDir(`${storagePath}/${book.id}`);
      await syncForEach(files, async file => await RNFS.unlink(file.path));
    } catch (e) {
      console.warn(e);
    }
    Toast.show({
      text: 'Cache successfully cleared',
    });
    transit("NoCache");
  };

  const history = useHistory();

  const Control = ((stateType) => {
    switch (stateType) {
      case "NoCache":
        return <CircleButton size={49} onPress={state.download}>
          <FeatherIcon name="arrow-down" />
        </CircleButton>;
      case "Loading":
        return <Progress.Circle size={49} indeterminate/>;
      case "Clearing":
        return <Progress.Circle size={49} indeterminate color="red">
          <FeatherIcon name="trash" />
        </Progress.Circle>;
      case "Destroying":
        return <Progress.Circle size={49} indeterminate color="red">
          <FeatherIcon name="close" />
        </Progress.Circle>;
      case "Downloading":
        return <Progress.Circle size={49} progress={progress} indeterminate={progress == 0}/>
      case "Playing":
        return <CircleButton size={49} onPress={state.toggle} style={{ borderColor: isActive ? 'white' : undefined}}>
          <FeatherIcon name={playbackState == PlayerState.Playing && isActive ? 'pause' : 'play'} style={{ color: isActive ? 'white' : undefined }} />
        </CircleButton>;
      case "Ready":
        // return book && <PlaybackButton book={book}/>
        return <CircleButton size={49} onPress={state.load} style={{ borderColor: isActive ? 'white' : undefined}}>
          <FeatherIcon name={'play'} style={{ color: isActive ? 'white' : undefined }} />
        </CircleButton>;
    }
  })(stateType);

  const time = (chapters?.length ?? 0) > 0 && (chapters?.map(chapter => chapter.duration).reduce((acc, val) => acc + val ?? 0) ?? 0) || 0;

  return <TouchableOpacity onPress={() => history.push(`${book?.id}/chapters`)} onLongPress={() => {
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
          callback: state.clear,
        },
      ],
    });
  }}>
    <Container style={{backgroundColor: isActive ? Colors.accent : 'transparent', borderRadius: 12 }}>
      <Thumb source={{uri: book?.thumbnail}}/>
      <Meta>
        <Title    inverted={isActive} numberOfLines={1}>{book?.title ?? 'undefined'}</Title>
        <Subtitle inverted={isActive} numberOfLines={1}>{book?.author}</Subtitle>
        <Subtitle inverted={isActive} numberOfLines={1}>{prettyTime(time)}</Subtitle>
      </Meta>
      <Right style={{ flexDirection: 'row', marginRight: 8 }}>
        { Control }
        {/*<Button transparent iconLeft onPress={() => {
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
              callback: state.clear,
            },
          ],
        });
      }} style={{
        justifyContent: 'center', alignItems: 'center',
        height: 48,
        width: 40,
      }}>
        <Icon type="Entypo" name="dots-two-vertical" style={{fontSize: 18, color: isActive ? 'white' : undefined}}/>
      </Button>*/}
      </Right>
    </Container>
  </TouchableOpacity>;
};
