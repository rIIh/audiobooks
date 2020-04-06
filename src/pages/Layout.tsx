import React, {useCallback, useEffect, useRef, useState} from "react";
import {Alert, StatusBar, TextInput, View} from "react-native";
import { useClipboard } from '@react-native-community/hooks'
import {
  Button,
  Container,
  Content,
  Text,
  Icon,
  Toast,
  Input, Item, Spinner, InputGroup,
} from "native-base";
import {BookObject, URLConstraints, useBookParser} from "../components/BookParser";
import Book from "../../model/Book";
import {useObservable} from "rxjs-hooks";
import {useDatabase} from "@nozbe/watermelondb/hooks";
import Modal from 'react-native-modal';
import { Dialog } from '../components/Dialog';
import Chapter from "../../model/Chapter";
import {BookCard} from "../components/BookCard";
import {hmsParse} from "../../lib/hmsParser";
import {MiniPlayerSheet, PlayerSheet} from "../components/Player";
import {BOTTOM_BAR_HEIGHT} from "../../lib/layout/constants";
import FeatherIcon from "../../lib/feather1s-extended";
import {Books} from "../state/Books";

const hashCode = (s: string) => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);

const log = (data: any) => {
  console.log(data);
  console.log({ data: JSON.stringify(data) });
};

const URLDialog: React.FC<{ show: boolean; confirm?: (url: string) => void; dismiss?: () => void}> = ({ show, confirm, dismiss }) => {
  const [input, setInput] = useState('');
  const [inClipboard] = useClipboard();
  const ref = useRef<TextInput>(null);
  useEffect(() => {
    if (show) {
      if (URLConstraints.regex.test(inClipboard) && input == '') {
        setInput(inClipboard);
      }
      if (input == '') { ref.current?.focus(); }
    } else {
      setInput('');
    }
  }, [show]);

  return <Modal isVisible={show}
                useNativeDriver
                onBackdropPress={dismiss}
                onModalHide={() => setInput('')}
                onBackButtonPress={dismiss}
  >
    <Dialog.Container>
      <Dialog.Title>Book URL</Dialog.Title>
      <Item>
        <Input getRef={ref} value={input} onChangeText={setInput}/>
      </Item>
      <Dialog.Actions>
        <Button rounded info onPress={() => {
          confirm?.(input);
          dismiss?.();
        }}>
          <Text>Add</Text>
        </Button>
      </Dialog.Actions>
    </Dialog.Container>
  </Modal>;
};

const CustomizedHeader = () => {
  const database = useDatabase();
  const bookParser = useBookParser();
  const booksCollection = database.collections.get<Book>(Book.table);
  const chaptersCollection = database.collections.get<Chapter>(Chapter.table);
  const [modal, setModal] = useState(false);

  const createBook = useCallback((bookData: BookObject) => {
    log(bookData);
    database.action(async () => {
      const bookID = hashCode(bookData.title + bookData.author).toString();
      bookData.thumbnail = bookData.thumbnail.replace('42x.jpg', '400x.jpg');
      let book: Book;
      try {
        book = await booksCollection.find(bookID);
        book.update(record => {
          record.title = bookData.title;
          record.author = bookData.author;
          record.thumbnail = bookData.thumbnail;
        });
        await book.chapters.destroyAllPermanently();
      } catch (e) {
        book = await booksCollection.create(record => {
          record._raw.id = bookID;
          record.title = bookData.title;
          record.author = bookData.author;
          record.thumbnail = bookData.thumbnail;
        });
      }
      bookData.chapters.forEach((chapter, index) => {
        chaptersCollection.create(record => {
          record.index = index;
          record.book.set(book);
          record.title = chapter.title;
          record.downloadURL = chapter.downloadURL;
          record.duration = hmsParse(chapter.duration);
        })
      })
    })
  }, [database]);

  const addURL = useCallback(async (url) => {
    try {
      const result = await bookParser.parseBook(url);
      Toast.show({ type: "success", text: result.title });
      createBook(result);
    } catch (reason) {
      Toast.show({ type: "danger", text: typeof reason === "string" ? reason : reason.message })
    }
  }, [bookParser]);

  return (
    <>
      <URLDialog show={modal} dismiss={() => setModal(false)} confirm={addURL} />
      <View style={{flexDirection: 'row', alignItems: 'center', padding:10, backgroundColor: '#f1f5f8'}}>
        <InputGroup rounded style={{flex:1, height: 40, backgroundColor:'#fff',paddingLeft:10, paddingRight:10, marginRight: 5, marginLeft: 10}}>
          <Icon name="ios-search" />
          <Input placeholder="Search Book" />
        </InputGroup>
        <Button dark transparent onPress={() => setModal(true)}>
          <Icon name="add" />
        </Button>
      </View>
    </>
  );
};

export const Layout: React.FC = () => {
  const bookParser = useBookParser();
  const { books } = Books.useContainer();

  return <>
    <StatusBar backgroundColor="#E8ECEF" barStyle="dark-content" />
    <Container>
      <CustomizedHeader/>
      <Content style={{ backgroundColor: '#f1f5f8' }}>
        {
          books?.map(book => <BookCard key={book.id} _book={book}/>)
        }
        { bookParser.isProcessing && <Spinner/> }
      </Content>
      <MiniPlayerSheet/>
      <View style={{ height: BOTTOM_BAR_HEIGHT, width: '100%', backgroundColor: 'white', elevation: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        <FeatherIcon name="home" size={24}/>
        <FeatherIcon name="home" size={24}/>
        <FeatherIcon name="home" size={24}/>
        <FeatherIcon name="home" size={24}/>
      </View>
    </Container>
    <PlayerSheet/>
    {/*<Player/>*/}
  </>
};
