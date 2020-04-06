import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import BottomSheet from "reanimated-bottom-sheet";
import {H3, Icon, Separator, Text, View,} from 'native-base';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {Dimensions, StatusBar, ViewStyle} from "react-native";
import Slider from '@react-native-community/slider';
import {CircleButton} from "./CircleButton";
import {PlayerState} from "../../lib/track-player";
import {Thumb} from "./BookCard";
import {BorderlessButton, TouchableWithoutFeedback} from "react-native-gesture-handler";
import {prettyTime} from "../../lib/hmsParser";
import Video from 'react-native-video';
import {BOTTOM_BAR_HEIGHT} from "../../lib/layout/constants";
import {Playback} from "../state/PlayerState";
import {StyledButton, ThinButton} from "./ThinButton";
import {Handle} from "./Handle";

const SNAP_POINTS = [Math.ceil(Dimensions.get('window').height - (StatusBar.currentHeight ?? 0)), 0];

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
  padding-top: 64px;
  align-items: center;
  overflow: visible;
  z-index: 10000;
`;


const Progress: React.FC<{
  containerStyle?: ViewStyle,
  progress: number,
  position?: number,
  duration?: number,
  onSlidingStart?: () => void,
  onSlidingEnd?: () => void,
  onProgressChanged?: (newValue: number) => void
}> = ({
        containerStyle,
        onProgressChanged,
        progress, duration, position,
        onSlidingStart, onSlidingEnd
      }) => {
  const [localProgress, setProgress] = useState(progress);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    if (!dragging) {
      setProgress(progress);
    }
  }, [progress]);

  const onDragStart = useCallback(() => {
    setDragging(true);
  }, []);

  return <>
    <Slider
      maximumValue={1}
      minimumValue={0}
      value={localProgress}
      onTouchStart={onSlidingStart}
      onTouchEnd={onSlidingEnd}
      onSlidingStart={onDragStart}
      onValueChange={setProgress}
      onSlidingComplete={newValue => {
        onProgressChanged?.(newValue);
        setDragging(false);
      }}

      style={[containerStyle, {
        width: '110%'
      }]}
    />
    {position != undefined && duration != undefined &&
    <View style={{
      flexDirection: 'row',
      marginTop: -5,
      justifyContent: 'space-between', width: containerStyle?.width
    }}>
        <Text style={{fontSize: 12, color: 'grey'}}>{prettyTime(position, [false, true, true])}</Text>
        <Text style={{fontSize: 12, color: 'grey'}}>{prettyTime(duration, [false, true, true])}</Text>
    </View>}
  </>
};

export const VideoSource = () => {
  const {dataSource} = Playback.useContainer();
  return dataSource.fileSource != null &&
      <Video source={{uri: dataSource.fileSource}}
             audioOnly playInBackground playWhenInactive paused={dataSource.state == PlayerState.Paused}
             nativeID="book_player"
             progressUpdateInterval={1000}
             onSeek={({currentTime}) => dataSource.state != PlayerState.Playing && dataSource.updateProgress({currentTime})}
             onProgress={dataSource.updateProgress}
             onEnd={dataSource.nextFile}
             ref={dataSource.setRef}
      />
    || null;
};

const MiniPlayer = () => {
  const { currentState: { book, position, progress, duration }, dataSource, methods } = Playback.useContainer();

  const subtitle = useMemo(() => <Text style={{
    color: 'grey',
    fontSize: 12
  }}>{book?.author} / {prettyTime(position, [false, true, true])} - {prettyTime(duration, [false, true, true])}</Text>,
    [position]);

  return useMemo(() => <MiniPlayerView>
    {
      book != null && <>
          <View>
              <Text>{book?.title}</Text>
              { subtitle }
          </View>
          <View style={{flexDirection: 'row'}}>
            {book && <CircleButton onPress={methods.toggle}>
                <Icon type="FontAwesome5"
                      name={dataSource.state == PlayerState.Playing ? 'pause' : dataSource.state == PlayerState.Paused ? 'play' : 'stop'}
                      style={{fontSize: 12}}/>
            </CircleButton>}
          </View>
          <View style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>
              <View style={{width: `${progress * 100}%`, backgroundColor: '#aef', height: 4}}/>
          </View>
      </>
    }
  </MiniPlayerView>, [book, progress, duration, dataSource, methods]);
};

export const Player = () => {
  const { currentState: { book, position, progress, duration, chapter }, dataSource, methods, player: { setInteractionState } } = Playback.useContainer();

  const jumpForward = useCallback(() => methods.jump(30), [methods.jump]);
  const jumpBackward = useCallback(() => methods.jump(-30), [methods.jump]);

  return <BodyView>
    {
      book != null && <>
          <Thumb height={Dimensions.get("window").height * 0.4} source={{uri: book?.thumbnail}}/>
          <Separator style={{backgroundColor: 'transparent'}}/>
          <H3>{book?.title}</H3>
          <Text style={{color: 'grey', fontSize: 12}}>{book?.author}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{
                color: 'grey',
                fontSize: 14
              }}>{chapter?.title}</Text>
          </View>
          <Separator style={{backgroundColor: 'transparent'}}/>
          <Progress progress={progress}
                    position={position}
                    duration={duration}
                    onSlidingStart={() => setInteractionState(false)}
                    onSlidingEnd={() => setInteractionState(true)}
                    onProgressChanged={methods.moveTo}
                    containerStyle={{width: '100%'}}/>
          <Separator style={{backgroundColor: 'transparent'}}/>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%'}}>
              <BorderlessButton style={{height: 36, width: 36, alignItems: 'center', justifyContent: 'center'}}
                                onPress={methods.previous}
              >
                  <Icon type="FontAwesome5" name="step-backward" style={{fontSize: 18}}/>
              </BorderlessButton>
              <BorderlessButton
                  onPress={jumpBackward}
                                style={{height: 36, width: 36, alignItems: 'center', justifyContent: 'center'}}>
                  <Text>-30s</Text>
              </BorderlessButton>
              <CircleButton size={64} onPress={methods.toggle}>
                  <Icon type="FontAwesome5"
                        name={dataSource.state == PlayerState.Playing ? 'pause' : dataSource.state == PlayerState.Paused ? 'play' : 'stop'}
                        onPress={methods.toggle}
                        style={{fontSize: 14}}/>
              </CircleButton>
              <BorderlessButton
                  onPress={jumpForward}
                  style={{height: 36, width: 36, alignItems: 'center', justifyContent: 'center'}}>
                  <Text>+30s</Text>
              </BorderlessButton>
              <BorderlessButton style={{height: 36, width: 36, alignItems: 'center', justifyContent: 'center'}}
                                onPress={methods.next}
              >
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
              <ThinButton name={(chapter?.index ?? 0) % 2 == 0 ? 'bookmark-filled' : 'bookmark'} size={24}/>
              <StyledButton>
                  <Text>1x</Text>
              </StyledButton>
              <ThinButton name="menu" size={24}/>
          </View>
      </>
    }
  </BodyView>
};

export const MiniPlayerSheet = () => {
  const { methods: { switchPlayer, drop }, currentState: { book } } = Playback.useContainer();
  const sheet = useRef<BottomSheet>(null);
  useEffect(() => {
    sheet.current?.snapTo(book == null ? 1 : 0);
    sheet.current?.snapTo(book == null ? 1 : 0);
    console.log('Book changed')
  }, [book]);
  return useMemo(() => <BottomSheet snapPoints={[96 + BOTTOM_BAR_HEIGHT, 0]}
                                    initialSnap={book == null ? 1 : 0}
                                    ref={sheet}
                                    onCloseEnd={drop}
                                    renderContent={() => <TouchableWithoutFeedback onPress={() => switchPlayer(true)}><MiniPlayer /></TouchableWithoutFeedback>} />,
    [book])
};

export const PlayerSheet = () => {
  const fall = useRef(new Animated.Value(0));
  const sheet = useRef<BottomSheet>(null);
  const { player: { opened, interactionEnabled }, currentState: { book }, methods: { switchPlayer } } = Playback.useContainer();
  useEffect(() => {
    sheet.current?.snapTo(opened ? 0 : 1);
    sheet.current?.snapTo(opened ? 0 : 1);
    console.log('Player opened', opened);
  }, [opened]);

  return useMemo(() => <BottomSheet snapPoints={SNAP_POINTS}
                                    ref={sheet}
                                    enabledBottomClamp
                                    onCloseEnd={() => {
                                      switchPlayer(false);
                                      console.log('Player: Closed by gesture')
                                    }}
    enabledContentGestureInteraction={interactionEnabled}
    // callbackNode={fall.current}
                                    renderContent={() => <>
                                      <Handle value={fall.current}/>
                                      <Player/>
                                    </>}/>, [interactionEnabled]);
};

