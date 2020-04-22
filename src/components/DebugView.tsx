import Downloads from '../unstate/Downloads';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import { Button, Container, Content, Text, View } from 'native-base';
import { useLocation } from 'react-router-native';
import React, { useEffect, useState } from 'react';
import { DownloadTask } from '../../lib/downloader';
import { map } from 'rxjs/operators';
import { noop } from 'rxjs';
import styled from 'styled-components/native';
import FeatherIcon from '../../lib/feather1s-extended';
import Animated from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { clamp } from '../../lib/clamp';

const width = Dimensions.get('window').width;

const Draggable: React.FC = ({ children }) => {
  const [posX] = useState(new Animated.Value<number>(0));
  return (
    <PanGestureHandler onGestureEvent={e => posX.setValue(clamp(e.nativeEvent.absoluteX, 0, width - 32))}>
      <Animated.View style={{ translateX: posX }}>{children}</Animated.View>
    </PanGestureHandler>
  );
};

export const DebugView = () => {
  const downloads = Downloads.useContainer();
  const tasks = downloads.tasks;
  const [show, setShow] = useState(false);
  const location = useLocation();

  return (
    <Container style={{ position: 'absolute', width: '100%', backgroundColor: show ? 'rgba(255, 255, 255, 0.4)' : 'transparent', padding: 12 }}>
      <View>
        <Draggable>
          <Button icon small onPress={() => setShow(last => !last)} style={{ width: 32, justifyContent: 'center' }}>
            <FeatherIcon name="settings" />
          </Button>
        </Draggable>
      </View>
      <Content pointerEvents={show ? 'auto' : 'none'}>
        {show && (
          <>
            <DebugAtom>
              <Text>{location.pathname}</Text>
            </DebugAtom>
            <ScrollView>
              {tasks.toArray().map(([, task]) => (
                <TaskDebugView key={task.id} task={task} />
              ))}
            </ScrollView>
          </>
        )}
      </Content>
    </Container>
  );
};

const DebugAtom = styled.View`
  margin-bottom: 12px;
  background-color: white;
`;

const TaskDebugView: React.FC<{ task: DownloadTask }> = ({ task }) => {
  // const progress = useObservable(() => task.State.pipe(map(value => value.percent)));
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const sub = task.State.pipe(map(value => value.percent)).subscribe(setProgress, noop);
    return () => sub.unsubscribe();
  }, [task]);

  return (
    <DebugAtom pointerEvents="none">
      <Text style={{ fontSize: 12 }}>{decodeURI(task.meta.url)}</Text>
      <Text style={{ fontSize: 12 }}>{task.meta.path}</Text>
      <Text style={{ fontSize: 12 }}>
        {task.state} / {progress}
      </Text>
    </DebugAtom>
  );
};
