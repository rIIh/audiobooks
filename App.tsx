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
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { rootReducer } from './lib/redux';
import thunk from 'redux-thunk';
import migrations from './model/migrations';
import { BackHandler } from 'react-native';
import { VideoSource } from './src/components/Player';
import { Playback } from './src/state/PlayerState';
import { Books } from './src/state/Books';

BackHandler.addEventListener('hardwareBackPress', () => {});

const adapter = new SQLiteAdapter({
  schema,
  migrations,
});

const database = new Database({
  adapter,
  modelClasses: [Book, Chapter],
  actionsEnabled: true,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
  return (
    <Provider store={store}>
      <Root>
        <DatabaseProvider database={database}>
          <BookParser>
            <Downloads>
              <ActionSheetProvider>
                <Playback.Provider>
                  <Books.Provider>
                    <VideoSource />
                    <Layout />
                  </Books.Provider>
                </Playback.Provider>
              </ActionSheetProvider>
            </Downloads>
          </BookParser>
        </DatabaseProvider>
      </Root>
    </Provider>
  );
};

export default App;
