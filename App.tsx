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

const adapter = new SQLiteAdapter({
  schema,
});

const database = new Database({
  adapter,
  modelClasses: [Book, Chapter],
  actionsEnabled: true,
});

TrackPlayer.getInstance();

const App = () => {
  return (
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
  );
};

export default App;
