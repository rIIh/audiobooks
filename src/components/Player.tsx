import React, {createContext, useRef} from "react";
import BottomSheet from "reanimated-bottom-sheet";
import {H1, H3, Icon} from 'native-base';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {Dimensions, StatusBar} from "react-native";
import {CircleButton} from "./CircleButton";
import Playlist from "../../lib/TrackPlayer/Playlist";

const SNAP_POINTS = [Dimensions.get('screen').height - (StatusBar.currentHeight ?? 0), 64];

const Container = styled.View`
  background-color: white;
  padding: 0 24px;
`;

const HeaderView = styled(Container)`
  border-radius: 16px;
  align-items: center;
  flex-flow: row nowrap;
  justify-content: space-between;
  height: ${SNAP_POINTS[1]}px;
`;

const BodyView = styled(Container)`
  height: ${SNAP_POINTS[0]}px;
`;

const Header = () => {
  return (
    <HeaderView>
      <H1>Hello world</H1>
      <CircleButton onPress={() => Playlist.clearPlaylist()}>
        <Icon type="FontAwesome5" name="stop" style={{fontSize: 12}} />
      </CircleButton>
    </HeaderView>
  );
};

const Body = () => {
  return (
    <BodyView>
      <H3>From Europe</H3>
    </BodyView>
  );
};


export const Player: React.FC = () => {
  const fall = useRef(new Animated.Value(1));
  return (
    <BottomSheet
      snapPoints={SNAP_POINTS}
      initialSnap={1}
      enabledBottomInitialAnimation
      callbackNode={fall.current}
      renderHeader={Header}
      renderContent={Body}
    />
  );
};
