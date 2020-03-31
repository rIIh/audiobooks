import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import BottomSheet from "reanimated-bottom-sheet";
import {H3, Icon, Separator, Text, Thumbnail, View,} from 'native-base';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {Dimensions, Platform, StatusBar, ViewStyle, TouchableWithoutFeedback, ImageBackground} from "react-native";
import Slider from '@react-native-community/slider';
import {CircleButton, NativeCircleButton} from "./CircleButton";
import {TrackPlayerThunks} from "../../lib/redux/track-player/thunks";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../lib/redux";
import {PlayerState} from "../../lib/track-player";
import {Thumb} from "./BookCard";
import {BorderlessButton} from "react-native-gesture-handler";
import Chapter from "../../model/Chapter";
import FeatherIcon from "react-native-feather1s";
import {prettyTime} from "../../lib/hmsParser";
import {useAsyncMemo} from "../../lib/hooks";
import Video, {OnProgressData} from 'react-native-video';
import RNFS from 'react-native-fs';
import RNBackgroundDownloader from "react-native-background-downloader";
import {useDatabase} from "@nozbe/watermelondb/hooks";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import IoniconsIcon from "react-native-vector-icons/Ionicons";

const SNAP_POINTS = [Math.ceil(Dimensions.get('screen').height - (StatusBar.currentHeight ?? 0)), 0];

const Container = styled.View`
  background-color: white;
  padding: 0 24px;
`;

const MiniPlayerView = styled(Container)`
  align-items: center;
  flex-flow: row nowrap;
  justify-content: space-between;
  height: 96px;
  width: 100%;
`;

const BodyView = styled(Container)`
  height: ${SNAP_POINTS[0]}px;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  padding-top: 96px;
  align-items: center;
  overflow: visible;
`;

const StyledButton = styled(BorderlessButton)`
  height: 36px;
  width: 36px;
  align-items: center;
  justify-content: center;
`;

const ThinButton: React.FC<{ name: string; size?: number; onPress?: (event: any) => void }> = ({name, size, onPress}) => {
  return <StyledButton onPress={onPress}>
    <FeatherIcon name={name} style={{fontSize: size ?? 18 }}/>
  </StyledButton>;
};


const Progress: React.FC<{ containerStyle?: ViewStyle, progressStyle?: ViewStyle, progress: number, position?: number, duration?: number, onProgressChanged?: (newValue: number) => void }> = ({
                                                                                                                                                                                                 containerStyle,
                                                                                                                                                                                                 onProgressChanged,
                                                                                                                                                                                                 progressStyle, progress, duration, position
                                                                                                                                                                                               }) => {
  const [localProgress, setProgress] = useState(progress);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    if (!dragging) {
      setProgress(progress);
    }
  }, [progress]);

  const onSlidingStart = useCallback(() => {
    setDragging(true);
  }, []);

  const onSeek = useCallback(() => {
    setDragging(false);
  }, []);

  return <>
    <Slider
      maximumValue={1}
      minimumValue={0}
      onSlidingStart={onSlidingStart}
      onValueChange={setProgress}
      onSlidingComplete={newValue => {
        onProgressChanged?.(newValue);
        setDragging(false);
      }}
      value={localProgress}
      style={containerStyle}
    />
    {position != undefined && duration != undefined &&
    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: containerStyle?.width}}>
        <Text>{prettyTime(position, [false, true, true])}</Text>
        <Text>{prettyTime(duration, [false, true, true])}</Text>
    </View>}
    {/*<View style={{height: 4, flexDirection: 'row', ...containerStyle}}>*/}
    {/*  */}
    {/*  <View style={{flex: progress, backgroundColor: 'green', ...progressStyle}}/>*/}
    {/*</View>*/}
  </>
};

const MiniPlayer: React.FC<{ progress: number, position: number, duration: number, show: boolean }> = ({show, duration, position, progress}) => {
  const dispatch = useDispatch();
  const {activeBook, playbackState, waitingForBook} = useTypedSelector(state => state.trackPlayer);
  const dropBook = useCallback(() => dispatch(TrackPlayerThunks.dropBook()), [dispatch]);
  const toggle = useCallback(() => dispatch(TrackPlayerThunks.toggle()), [dispatch]);

  return (
    <MiniPlayerView>
      {
        show && <>
            <Thumbnail source={{uri: activeBook?.thumbnail}} resizeMode="contain" square
                       style={{height: '100%', overflow: 'hidden'}}/>
            <Animated.View>
                <Text>{activeBook?.title}</Text>
                <Text>{activeBook?.author} / {prettyTime(position, [false, true, true])} - {prettyTime(duration, [false, true, true])}</Text>
            </Animated.View>
            <Animated.View style={{flexDirection: 'row'}}>
              {activeBook && <NativeCircleButton onPress={e => {
                e.stopPropagation();
                dropBook();
              }}>
                  <Icon type="FontAwesome5" name="stop" style={{fontSize: 12}}/>
              </NativeCircleButton>}
              {activeBook && <NativeCircleButton onPress={e => {
                e.stopPropagation();
                toggle();
              }}>
                  <Icon type="FontAwesome5"
                        name={playbackState == PlayerState.Playing ? 'pause' : playbackState == PlayerState.Paused ? 'play' : 'stop'}
                        style={{fontSize: 12}}/>
              </NativeCircleButton>}
            </Animated.View>
            <Animated.View style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>
                <View style={{width: `${progress * 100}%`, backgroundColor: '#aef', height: 4}}/>
            </Animated.View>
        </>
      }
    </MiniPlayerView>
  );
};

export const Player: React.FC = () => {
  const fall = useRef(new Animated.Value(1));
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheet = bottomSheetRef.current;
  const playerRef = useRef<Video>(null);
  const player = playerRef.current;
  const [playerBusy, setPlayerBusy] = useState(false);
  const {activeBook, playbackState, waitingForBook} = useTypedSelector(state => state.trackPlayer);
  useEffect(() => {
    if (activeBook == null) {
      bottomSheet?.snapTo(1)
      bottomSheet?.snapTo(1)
    }
  }, [activeBook]);
  const dispatch = useDispatch();
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
  useEffect(() => {
    if (!playerBusy && moveToLastChapter) {
      setMoveToLastChapter(false);
      const currentChunk = map?.[currentFile] ?? [];
      if (currentChunk.length > 0) {
        let index = 0;
        player?.seek(currentChunk.map(chapter => chapter.duration).reduce((acc, val) => {
          if (currentChunk[index].id == currentChunk[currentChunk.length - 2].id) {
            return acc;
          } else {
            index++;
            return acc + val;
          }
        }))
      }
    }
  });
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
  const next = useCallback(() => {
    completeChapter();
    currentFile < files.length - 1 && setCurrentFile(currentFile + 1);
  }, [currentFile, files]);
  const past = useCallback(() => {
    if (currentFile > 0) {
      setMoveToLastChapter(true);
      setCurrentFile(currentFile - 1);
    }
  }, [currentFile, files]);
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

  const [currentChapter, chapterPosition] = useMemo(() => {
    if (!map || !chapters || !activeBook) {
      return [null, null];
    }
    // const pausesBefore = chapters.findIndex(_chapter => _chapter.id == map[fileIndex][0].id) * pauseDuration;
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
  const progress = useMemo(() => {
    if (chapterPosition && currentChapter) {
      return chapterPosition / currentChapter.duration;
    } else {
      return 0;
    }
  }, [chapterPosition, currentChapter]);

  const renderHeader = activeBook != null && <TouchableWithoutFeedback
      onPress={() => {
        console.log('Touched');
        bottomSheet?.snapTo(0);
      }}>
      <View>
          <MiniPlayer show={activeBook != null}
                      progress={progress}
                      position={chapterPosition ?? 0}
                      duration={currentChapter?.duration ?? fileProgress?.seekableDuration ?? 0}/>
      </View>
  </TouchableWithoutFeedback>;

  const renderHandler = () => {
    const animatedBar1Rotation = (outputRange: number[]) =>
      Animated.interpolate(fall.current, {
        inputRange: [0, 0.5],
        outputRange: outputRange,
        extrapolate: Animated.Extrapolate.CLAMP,
      })

    return (
      <View style={{
        position: 'absolute',
        alignSelf: 'center',
        top: 10,
        height: 20,
        width: 20,
      }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              backgroundColor: '#D1D1D6',
              top: 5,
              borderRadius: 3,
              height: 5,
              width: 20,
            },
            {
              left: -7.5,
              transform: [
                {
                  rotate: Animated.concat(
                    // @ts-ignore
                    animatedBar1Rotation([0.3, 0]),
                    'rad'
                  ),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            {
              position: 'absolute',
              backgroundColor: '#D1D1D6',
              top: 5,
              borderRadius: 3,
              height: 5,
              width: 20,
            },
            {
              right: -7.5,
              transform: [
                {
                  rotate: Animated.concat(
                    // @ts-ignore
                    animatedBar1Rotation([-0.3, 0]),
                    'rad'
                  ),
                },
              ],
            },
          ]}
        />
      </View>
    )
  }

  const Body = () => {
    return (
      <BodyView>
        {renderHandler()}
        {
          activeBook != null && files.length > 0 &&
          <Video audioOnly
                 onProgress={setFileProgress}
                 onEnd={() => {
                   currentFile < files.length && setCurrentFile(currentFile + 1)
                 }}
                 paused={playbackState == PlayerState.Paused}
                 playInBackground
                 playWhenInactive
                 onLoadStart={() => setPlayerBusy(true)}
                 onLoad={() => setPlayerBusy(false)}
                 ref={playerRef}
                 source={{
                   uri: files[currentFile]?.path ?? '',
                 }}/>
        }
        {
          fileProgress != null && player != null && map != null && chapterPosition != null && currentChapter != null && <>
              <Thumb height={Dimensions.get("window").height * 0.4} source={{uri: activeBook?.thumbnail}}/>
              <Separator style={{backgroundColor: 'transparent'}}/>
              <H3>{activeBook?.title}</H3>
              <Text>{activeBook?.author}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text>{currentChapter?.title ?? (map != null && map[currentFile] != null ? `${map[currentFile][0].title} - ${map[currentFile][map[currentFile].length - 1].title}` : 'undefined')}</Text>
                {currentChapter.complete &&
                <Icon type="FontAwesome" name="check-circle" style={{fontSize: 14, marginLeft: 4}}/>}
              </View>
              <Separator style={{backgroundColor: 'transparent'}}/>
              <Progress progress={progress}
                        position={chapterPosition ?? 0}
                        duration={currentChapter?.duration ?? fileProgress.seekableDuration}
                        onProgressChanged={newValue => {
                          const newPosition = fileProgress.currentTime - chapterPosition + currentChapter.duration * newValue;
                          player?.seek(newPosition);
                        }}
                        containerStyle={{width: '100%'}}
                        progressStyle={{backgroundColor: '#70a5ff'}}/>
              <Separator style={{backgroundColor: 'transparent'}}/>
              <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%'}}>
                  <BorderlessButton style={{height: 36, width: 36, alignItems: 'center', justifyContent: 'center'}}
                                    onPress={() => {
                                      chapterPosition && currentChapter && currentChapter != map[currentFile][0] ?
                                        player.seek(fileProgress!.currentTime - chapterPosition
                                          - map[currentFile][Math.max(0, map[currentFile].indexOf(currentChapter) - 1)].duration) :
                                        past()
                                    }}>
                      <Icon type="FontAwesome5" name="step-backward" style={{fontSize: 18}}/>
                  </BorderlessButton>
                  <BorderlessButton onPress={() => player?.seek(Math.max(0, fileProgress!.currentTime - 30))}
                                    style={{height: 36, width: 36, alignItems: 'center', justifyContent: 'center'}}>
                      <Text>-30s</Text>
                  </BorderlessButton>
                  <CircleButton size={64} onPress={toggle}>
                      <Icon type="FontAwesome5"
                            name={playbackState == PlayerState.Playing ? 'pause' : playbackState == PlayerState.Paused ? 'play' : 'stop'}
                            style={{fontSize: 14}}/>
                  </CircleButton>
                  <BorderlessButton
                      onPress={() => player?.seek(Math.min(fileProgress!.seekableDuration, fileProgress!.currentTime + 30))}
                      style={{height: 36, width: 36, alignItems: 'center', justifyContent: 'center'}}>
                      <Text>+30s</Text>
                  </BorderlessButton>
                  <BorderlessButton style={{height: 36, width: 36, alignItems: 'center', justifyContent: 'center'}}
                                    onPress={() => {
                                      chapterPosition && currentChapter ?
                                        player.seek(fileProgress!.currentTime - chapterPosition + currentChapter.duration) :
                                        next()
                                    }}>
                      <Icon type="FontAwesome5" name="step-forward" style={{fontSize: 18}}/>
                  </BorderlessButton>
              </View>
              <Separator style={{backgroundColor: 'transparent'}}/>
              <View style={{
                height: 50,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
                  <ThinButton name="clock" size={24}/>
                  <ThinButton name="bookmark" size={24}/>
                  <StyledButton>
                    <IoniconsIcon name="md-bookmark" style={{ fontSize: 22 }}/>
                  </StyledButton>
                  <StyledButton>
                    <Text>1x</Text>
                  </StyledButton>
                  <ThinButton name="menu" size={24}/>
              </View>
          </>
        }
      </BodyView>
    );
  };

  return (
    <>
      {renderHeader}
      <BottomSheet
        snapPoints={SNAP_POINTS}
        initialSnap={1}
        ref={bottomSheetRef}
        enabledBottomInitialAnimation
        enabledHeaderGestureInteraction={activeBook != null}
        // enabledContentGestureInteraction={false}
        callbackNode={fall.current}
        renderContent={Body}
      />
    </>
  );
};
