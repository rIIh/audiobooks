/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { Database } from '@nozbe/watermelondb';
import schema from './model/schema';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import Book from './model/Book';
import Chapter from './model/Chapter';
import { BookParser } from './src/components/BookParser';
import { Layout } from './src/pages/Layout';
import { Root } from 'native-base';
import { Downloads } from './src/components/Downloads';
import { ActionSheetProvider } from './src/components/ActionSheet';
import TrackPlayer from './lib/TrackPlayer/TrackPlayer';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { rootReducer } from './lib/redux';
import _ from 'lodash';
import thunk from 'redux-thunk';
import RNTrackPlayer from 'react-native-track-player';
import { getState } from './lib/react-native-track-player';
import { TrackPlayerActions } from './lib/redux/track-player/actions';
import migrations from './model/migrations';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
});

const database = new Database({
  adapter,
  modelClasses: [Book, Chapter],
  actionsEnabled: true,
});

TrackPlayer.getInstance();

const store = createStore(rootReducer, applyMiddleware(thunk));

const updateState = _.debounce(
  (state: RNTrackPlayer.State) => store.dispatch(TrackPlayerActions.setState(getState(state))),
  30,
);

RNTrackPlayer.addEventListener('playback-state', ({ state }) => {
  updateState(state);
});

const App = () => {
  return (
    <Provider store={store}>
      <Root>
        <DatabaseProvider database={database}>
          <BookParser>
            <Downloads>
              <ActionSheetProvider>
                <Layout />
              </ActionSheetProvider>
            </Downloads>
          </BookParser>
        </DatabaseProvider>
      </Root>
    </Provider>
  );
};

export default App;
