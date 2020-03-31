import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import BottomSheet from "reanimated-bottom-sheet";
import {H3, Icon, Separator, Text, View,} from 'native-base';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {Dimensions, Platform, StatusBar, ViewStyle} from "react-native";
import Slider from '@react-native-community/slider';
import {CircleButton} from "./CircleButton";
import {TrackPlayerThunks} from "../../lib/redux/track-player/thunks";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../lib/redux";
import {PlayerState} from "../../lib/react-native-track-player";
import {Thumb} from "./BookCard";
import {BorderlessButton} from "react-native-gesture-handler";
import Chapter from "../../model/Chapter";
import RNTrackPlayer from "react-native-track-player";
import useAsyncEffect from "use-async-effect";
import TrackPlayer from "../../lib/TrackPlayer/TrackPlayer";
import {prettyTime} from "../../lib/hmsParser";
import Playlist from "../../lib/TrackPlayer/Playlist";
import {useAsyncMemo} from "../../lib/hooks";
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import RNBackgroundDownloader from "react-native-background-downloader";

const SNAP_POINTS = [Math.ceil(Dimensions.get('screen').height - (StatusBar.currentHeight ?? 0)), 96];

const Container = styled.View`
  background-color: white;
  padding: 0 24px;
`;

const HeaderView = styled(Container)`
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  align-items: center;
  flex-flow: row nowrap;
  justify-content: space-between;
  height: ${SNAP_POINTS[1]}px;
`;

const BodyView = styled(Container)`
  height: ${SNAP_POINTS[0] - SNAP_POINTS[1]}px;
  padding-top: 1px;
  align-items: center;
  overflow: visible;
`;

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
    {position != undefined && duration != undefined &&
    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: containerStyle?.width}}>
        <Text>{prettyTime(position, [false, true, true])}</Text>
        <Text>{prettyTime(duration, [false, true, true])}</Text>
    </View>}

    <View style={{height: 4, flexDirection: 'row', ...containerStyle}}>
      <Slider
        maximumValue={1}
        minimumValue={0}
        onSlidingStart={onSlidingStart}
        onValueChange={setProgress}
        onSlidingComplete={newValue => {
          onProgressChanged?.(localProgress);
          setDragging(false);
        }}
        value={localProgress}
        minimumTrackTintColor={'#222'}
        maximumTrackTintColor={'#555'}
        style={containerStyle}
      />
      <View style={{flex: progress, backgroundColor: 'green', ...progressStyle}}/>
    </View>
  </>
};

const Header: React.FC<{ fall: Animated.Value<number>, progress: number, position: number, duration: number, show: boolean }> = () => {
  return (
    <HeaderView>

    </HeaderView>
  );
};

export const AnotherPlayer: React.FC = () => {
  const fall = useRef(new Animated.Value(1));
  const {activeBook, playbackState, waitingForBook} = useTypedSelector(state => state.trackPlayer);
  const dispatch = useDispatch();
  const toggle = useCallback(() => dispatch(TrackPlayerThunks.toggle()), [dispatch]);
  const [chapters, setChapters] = useState<Chapter[]>();
  const files = useAsyncMemo(async () => {
    if (Platform.OS == "android") {
      try {
        return await RNFS.readDir(`${RNBackgroundDownloader.directories.documents}/${activeBook?.id}`);
      }
      catch (e) {}
      return [];
    } else {
      return [];
    }
  }, [activeBook], []);
  useEffect(() => {
    const subscribed = activeBook?.chapters.observe().subscribe(setChapters);
    return () => {
      try {
        subscribed?.unsubscribe();
      } catch (e) {
        console.log(e);
      }
    };
  }, [activeBook]);
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
  const durations = map?.map(_chapters => _chapters.map(chapter => chapter.duration).reduce((acc, val) => acc + val));

  const renderHeader = () => {
    return <Header fall={fall.current}
                   show={activeBook != null}
                   progress={0}
                   position={0} duration={0}/>;
  };

  const Body = () => {
    return (
      <BodyView>
        { activeBook != null && files.length > 0 && <Video audioOnly
                                                           paused={playbackState == PlayerState.Paused}
                                                           source={{
                                                             uri: files[0]?.path ?? '',
                                                           }}/>}
      </BodyView>
    );
  };

  return (
    <BottomSheet
      snapPoints={SNAP_POINTS}
      initialSnap={1}
      enabledBottomInitialAnimation
      enabledHeaderGestureInteraction={activeBook != null}
      enabledContentGestureInteraction={false}
      callbackNode={fall.current}
      renderHeader={renderHeader}
      renderContent={Body}
    />
  );
};
