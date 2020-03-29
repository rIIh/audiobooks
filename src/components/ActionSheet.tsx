import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Button, Icon, Text} from 'native-base';
import BottomSheet from 'reanimated-bottom-sheet';
import {Alert, Dimensions, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import styled from 'styled-components/native';
import {noop} from '../../lib/noop';
import Animated from "react-native-reanimated";

const SNAP_POINTS = [400, 0];
const HEADER_HEIGHT = 30;

const Container = styled.View`
  background-color: white;
  padding: 0 24px;
`;

const HeaderView = styled(Container)`
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  justify-content: center;
  height: ${HEADER_HEIGHT}px;
`;

const BodyView = styled(Container)`
  height: ${SNAP_POINTS[0] - HEADER_HEIGHT}px;
`;

type CloseCallback = () => void;

interface Options {
  actions?: {
    text: string;
    icon?: string;
    callback?: () => void;
  }[];
  destructive?: {
    text: string;
    icon?: string;
    alertText?: string;
    callback?: () => void;
  }[];
}

interface IActionSheetContext {
  show: (options: Options) => CloseCallback;
}

const ActionSheetContext = createContext<IActionSheetContext>({
  show: noop,
});

const Header = () => {
  return (
    <HeaderView/>
  );
};

const Body: React.FC<{ options: Options, dismiss: () => void }> = ({options, dismiss}) => {
  return (
    <BodyView>
      {
        options.actions?.map((action, index) => <Button iconLeft dark
                                                        transparent full
                                                        onPress={() => {
                                                          action.callback?.();
                                                          dismiss();
                                                        }}
                                                        style={{justifyContent: 'flex-start'}}
                                                        key={index}>
          <Icon type="AntDesign" name={action.icon}/>
          <Text>{action.text}</Text>
        </Button>)
      }
      {
        options.destructive?.map((action, index) => <Button iconLeft danger
                                                            transparent full
                                                            onPress={() => {
                                                              console.log('Destructive action');
                                                              Alert.alert(
                                                                'asd',
                                                                action.alertText ?? 'Are you sure?',
                                                                [{
                                                                  text: 'No',
                                                                }, {
                                                                  text: 'Yes',
                                                                  onPress: () => {
                                                                    action.callback?.();
                                                                    dismiss();
                                                                  },
                                                                  style: "destructive",
                                                                }],
                                                              )
                                                            }}

                                                            style={{justifyContent: 'flex-start'}} key={index}>
          <Icon type="AntDesign" name={action.icon}/>
          <Text>{action.text}</Text>
        </Button>)
      }
    </BodyView>
  );
};

export const useActionSheet = () => useContext(ActionSheetContext);

enum State {
  Closed = 1,
  Opened = 0,
}

export const ActionSheetProvider: React.FC = ({children}) => {
  const bottomSheet = useRef<BottomSheet>(null);
  const [options, setOptions] = useState<Options>({
    actions: [],
  });
  const [shadow, setShadow] = useState(false);
  const fall = useRef<Animated.Value<number>>(new Animated.Value(State.Closed));

  const close = useCallback(() => {
    bottomSheet.current?.snapTo(State.Closed);
    bottomSheet.current?.snapTo(State.Closed);
  }, [bottomSheet.current]);

  const renderShadow = () => {
    const animatedShadowOpacity = Animated.interpolate(fall.current, {
      inputRange: [0, 1],
      outputRange: [0.5, 0],
    });

    return (
      <TouchableWithoutFeedback onPress={() => {
        bottomSheet.current?.snapTo(State.Closed);
        bottomSheet.current?.snapTo(State.Closed);
      }}>
        <Animated.View
          pointerEvents={shadow ? undefined : 'none'}
          style={[
            {...StyleSheet.absoluteFillObject, backgroundColor: 'black'},
            {
              opacity: animatedShadowOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>
    )
  }

  return (
    <ActionSheetContext.Provider
      value={{
        show: options => {
          setOptions(options);
          bottomSheet.current?.snapTo(State.Opened);
          bottomSheet.current?.snapTo(State.Opened);
          return () => {
            bottomSheet.current?.snapTo(State.Closed);
            bottomSheet.current?.snapTo(State.Closed);
          }
        },
      }}>
      {children}
      {renderShadow()}
      <BottomSheet
        ref={bottomSheet}
        snapPoints={SNAP_POINTS}
        onCloseEnd={() => setShadow(false)}
        onOpenStart={() => setShadow(true)}
        enabledContentGestureInteraction={false}
        initialSnap={State.Closed}
        callbackNode={fall.current}
        renderHeader={Header}
        renderContent={() => <Body dismiss={close} options={options}/>}
      />
    </ActionSheetContext.Provider>
  );
};
