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
import { BackButton, NativeRouter, Route, Switch } from 'react-router-native';
import { Database } from '@nozbe/watermelondb';
import schema from './model/schema';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import Book from './model/Book';
import Chapter from './model/Chapter';
import { BookParser } from './src/components/BookParser';
import { Layout } from './src/pages/Layout';
import { Root, StyleProvider, Text } from 'native-base';
import Downloads from './src/unstate/Downloads';
import { ActionSheetProvider } from './src/components/ActionSheet';
import migrations from './model/migrations';
import { BackHandler } from 'react-native';
import { VideoSource } from './src/components/BookSheet';
import { Playback } from './src/unstate/Playback';
import { Books } from './src/unstate/Books';
import compose from './src/unstate/compose';
import FilePath from './model/FilePath';
import { Chapters } from './src/pages/Chapters';
import { DebugView } from './src/components/DebugView';
import getTheme from './native-base-theme/components';

BackHandler.addEventListener('hardwareBackPress', () => {});

const adapter = new SQLiteAdapter({
  schema,
  migrations,
});

const database = new Database({
  adapter,
  modelClasses: [Book, Chapter, FilePath],
  actionsEnabled: true,
});

const NoMatch = () => <Text>No match</Text>;

const App = () => {
  const Store = compose(
    Books,
    Downloads,
    Playback,
  );
  return (
    <StyleProvider style={getTheme()}>
      <Root>
        <DatabaseProvider database={database}>
          <BookParser>
            <ActionSheetProvider>
              <Store.Provider>
                <VideoSource />
                <NativeRouter>
                  <BackButton />
                  <Switch>
                    <Route exact path="/" component={Layout} />
                    <Route path="/:book/chapters" component={Chapters} />
                    <Route component={NoMatch} />
                  </Switch>
                  <DebugView />
                </NativeRouter>
                {/*<Layout />*/}
              </Store.Provider>
            </ActionSheetProvider>
          </BookParser>
        </DatabaseProvider>
      </Root>
    </StyleProvider>
  );
};

export default App;
