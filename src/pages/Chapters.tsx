import React, { useEffect } from 'react';
import { View, Text } from 'native-base';
import { useParams } from 'react-router-native';
import Book from '../../model/Book';
import { useObservable } from 'rxjs-hooks';
import {Thumb} from "../components/BookCard";
import {ST2, T1} from "../components/Text/Title";
import {Tabs} from "../components/Filter";

interface ChaptersRouteParams {
  book: string;
}

export const Chapters: React.FC = () => {
  const { book: bookID } = useParams<ChaptersRouteParams>();
  const booksCollection = Book.useCollection();
  const book = useObservable(() => booksCollection.findAndObserve(bookID));

  return <View style={{ flexDirection: 'column', alignItems: 'center', paddingVertical: 42, paddingHorizontal: 32 }}>
    <Thumb height={256} aspectRatio={1} source={{uri: book?.thumbnail}}/>
    <View style={{ marginTop: 42, alignItems: 'center' }}>
      <T1>{ book?.title ?? 'Hello world' }</T1>
      <T1>{ 'Hello world' }</T1>
      <ST2>{ 'book?.author' }</ST2>
      <Tabs/>
    </View>
  </View>;
};
