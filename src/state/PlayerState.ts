import Video, {OnProgressData} from "react-native-video";
import {PlayerState} from "../../lib/track-player";
import Chapter from "../../model/Chapter";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Book from "../../model/Book";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../lib/redux";
import {TrackPlayerThunks} from "../../lib/redux/track-player/thunks";
import {useAsyncMemo} from "../../lib/hooks";
import {Platform} from "react-native";
import RNFS from "react-native-fs";
import RNBackgroundDownloader from "react-native-background-downloader";
import {useDatabase} from "@nozbe/watermelondb/hooks";
import {createContainer} from "unstated-next";

export type ProgressUpdate = (data: Partial<OnProgressData>) => void;

export interface PlayingBookState {
  dataSource: {
    state: PlayerState,
    updateProgress: ProgressUpdate,
    nextChapter: Chapter | null,
    nextFile: () => void,
    fileSource: string | null,
    setRef: React.RefObject<Video>,
  };
  player: {
    opened: boolean,
    interactionEnabled: boolean,
    setInteractionState: (value: boolean) => void,
  }
  currentState: {
    book: Book | null;
    chapter: Chapter | null;
    position: number;
    duration: number;
    progress: number;
  };
  methods: {
    toggle: () => void;
    drop: () => void;
    jump: (position: number) => void;
    changeChapter: (chapter: Chapter) => void;
    switchPlayer: (opened: boolean) => void;
    next: () => void;
    previous: () => void;
    moveTo: (progress: number) => void;
  };
}

const useBookPlayback = (): PlayingBookState => {
  const dispatch = useDispatch();
  const {activeBook, playbackState} = useTypedSelector(state => state.trackPlayer);
  const [playerOpened, setPlayerOpened] = useState(false);
  const player = useRef<Video>(null);
  const interactionState = useState(true);
  useEffect(() => {
    if (activeBook == null) {
      setPlayerOpened(false);
    }
  }, [activeBook]);
  const drop = useCallback(() => dispatch(TrackPlayerThunks.dropBook()), [dispatch]);
  const toggle = useCallback(() => dispatch(TrackPlayerThunks.toggle()), [dispatch]);
  const chapters = useAsyncMemo(async () => await activeBook?.chapters.fetch(), [activeBook], null);
  const files = useAsyncMemo(async () => {
    if (Platform.OS == "android") {
      try {
        return await RNFS.readDir(`${RNBackgroundDownloader.directories.documents}/${activeBook?.id}`);
      } catch (e) {

      }
      return [];
    } else {
      return [];
    }
  }, [activeBook], []);
  const [currentFile, setCurrentFile] = useState(0);
  const [moveToLastChapter, setMoveToLastChapter] = useState(false);
  // useEffect(() => {
  //   if (!playerBusy && moveToLastChapter) {
  //     setMoveToLastChapter(false);
  //     const currentChunk = map?.[currentFile] ?? [];
  //     if (currentChunk.length > 0) {
  //       let index = 0;
  //       player?.seek(currentChunk.map(chapter => chapter.duration).reduce((acc, val) => {
  //         if (currentChunk[index].id == currentChunk[currentChunk.length - 2].id) {
  //           return acc;
  //         } else {
  //           index++;
  //           return acc + val;
  //         }
  //       }))
  //     }
  //   }
  // });

  const db = useDatabase();
  const completeChapter = (threshold: number = 0.95) => {
    if (chapterPosition && currentChapter && !currentChapter.complete) {
      if (chapterPosition / currentChapter.duration > threshold) {
        db.action(async () => {
          currentChapter.update(record => {
            record.complete = true;
          });
        });
        console.log('Completed')
      }
    }
  };
  const [fileProgress, setFileProgress] = useState<OnProgressData | null>(null);

  const map = useMemo(() => {
    const zipped = chapters?.map<[string, Chapter]>(chapter => [chapter.downloadURL, chapter]);
    if (zipped) {
      const result: Chapter[][] = [[]];
      let file = 0;
      for (let i = 0; i < zipped.length; i++) {
        const value = zipped[i];
        if (result[file].length > 0 && result[file][0].downloadURL != value[0]) {
          file++;
          result.push([]);
        }
        result[file].push(value[1]);
      }
      return result;
    } else {
      return null;
    }
  }, [chapters]);

  const [currentChapter, chapterPosition] = useMemo<[Chapter | null, number | null]>(() => {
    if (!map || !chapters || !activeBook) {
      return [null, null];
    }
    const currentTime = fileProgress?.currentTime ?? 0;
    let left = currentTime; // - pausesBefore - pauseDuration;
    let chapterIndex = 0;
    for (let chapter of map[currentFile]) {
      const chapterDuration = chapter.duration;
      if (left > chapterDuration) {
        left -= chapterDuration;// + pauseDuration;
        chapterIndex++;
      } else {
        if (chapterIndex == 0) {
          return [chapter, currentTime];
        }
        return [chapter, currentTime - map[currentFile].slice(0, chapterIndex).map(chapter => chapter.duration).reduce((acc, val) => acc + val)];
      }
    }
    return [null, null];
  }, [fileProgress?.currentTime, currentFile]);

  useEffect(() => {
    completeChapter(0.99);
  }, [chapterPosition]);

  return {
    dataSource: {
      state: playbackState,
      setRef: player,
      updateProgress: data => setFileProgress(last => ({
        currentTime: 0,
        seekableDuration: 0,
        playableDuration: 0, ...last, ...data
      })),
      nextChapter: null,
      fileSource: files[currentFile]?.path,
      nextFile: () => setCurrentFile(last => {
        if (last >= files.length - 1) {
          return 0;
        } else {
          return last + 1;
        }
      }),
    },
    player: {
      opened: playerOpened,
      interactionEnabled: interactionState[0],
      setInteractionState: interactionState[1],
    },
    currentState: {
      book: activeBook,
      chapter: currentChapter,
      position: chapterPosition ?? 0,
      duration: currentChapter?.duration ?? 0,
      progress: (chapterPosition ?? 0) / (currentChapter?.duration ?? 1),
    },
    methods: {
      toggle,
      drop,
      jump: (delta: number) => {
        player.current?.seek((fileProgress?.currentTime ?? 0) + delta);
      },
      switchPlayer: (state) => {
        setPlayerOpened(state);
      },
      changeChapter: chapter => {

      },
      moveTo: progress => {
        if (!fileProgress || !chapterPosition || !currentChapter) {
          return;
        }
        const newPosition = fileProgress.currentTime - chapterPosition + currentChapter.duration * progress;
        player.current?.seek(newPosition);
      },
      previous: () => {
        if (chapterPosition && currentChapter && map && currentChapter != map[currentFile][0]) {
          const position = fileProgress!.currentTime - chapterPosition
            - map[currentFile][Math.max(0, map[currentFile].indexOf(currentChapter) - 1)].duration + 0.1;
          player.current?.seek(position);
        }
      },
      next: () => {
        if (fileProgress && chapterPosition && currentChapter) {
          player.current?.seek(fileProgress!.currentTime - chapterPosition + currentChapter.duration + 0.1);
        }
      },
    },
  }
};

export const Playback = createContainer(useBookPlayback);
