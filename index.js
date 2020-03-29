/**
 * @format
 */

import { AppRegistry, YellowBox } from 'react-native';
import App from './App';
import RNTrackPlayer from 'react-native-track-player';
import { name as appName } from './app.json';

YellowBox.ignoreWarnings(['Animated: `useNativeDriver`']);

AppRegistry.registerComponent(appName, () => App);

RNTrackPlayer.registerPlaybackService(() => require('./service.js'));
