import React, {useCallback, useEffect, useRef, useState} from "react";
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, TextInput} from "react-native";
import {useClipboard} from '@react-native-community/hooks'
import {Button, Container, Content, Icon, Input, InputGroup, Item, Spinner, Text, Toast, View} from "native-base";
import {BookObject, URLConstraints, useBookParser} from "../components/BookParser";
import Book from "../../model/Book";
import {useDatabase} from "@nozbe/watermelondb/hooks";
import Modal from 'react-native-modal';
import {Dialog} from '../components/Dialog';
import Chapter from "../../model/Chapter";
import {BookCard} from "../components/BookCard";
import {hmsParse} from "../../lib/hmsParser";
import {MiniPlayerSheet, PlayerSheet} from "../components/BookSheet";
import {BOTTOM_BAR_HEIGHT} from "../../lib/layout/constants";
import FeatherIcon from "../../lib/feather1s-extended";
import {Books} from "../unstate/Books";
import FilePath from "../../model/FilePath";
import {ajax} from "rxjs/ajax";
import {Colors} from "../../lib/colors";
import {BorderlessButton} from "react-native-gesture-handler";

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
  const filesCollection = database.collections.get<FilePath>(FilePath.table);
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

      const links = [...new Set(bookData.chapters.map(chapter => chapter.downloadURL.replace(/^"|"$/g, '')))];
      const files = new Map<string, FilePath>();
      for (let [index, link] of links.entries()) {
        const extension = link.slice(link.lastIndexOf('.')).length > 5 ? undefined : link.slice(link.lastIndexOf('.'));
        let response: string | null = null;
        try {
          response = (await ajax({
            url: link, method: 'HEAD'
          }).toPromise()).xhr.getResponseHeader('Content-Length');
        }
        catch (e) {
          console.warn(e);
        }
        const remoteSize = response != null ? parseInt(response) : null;
        files.set(link, await filesCollection.create(record => {
          record.path = `${book.id}/${index}${extension}`;
          record.url = link;
          record.book.set(book);
          record.remoteSize = remoteSize;
        }));
      }

      bookData.chapters.forEach((chapter, index) => {
        chaptersCollection.create(record => {
          record.index = index;
          record.book.set(book);
          record.title = chapter.title;
          record.downloadURL = chapter.downloadURL.replace(/^"|"$/g, '');
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
      <View style={{flexDirection: 'row', paddingHorizontal: 24, alignItems: 'center', paddingVertical: 12, backgroundColor: '#f1f5f8', justifyContent: 'space-between' }}>
        <URLDialog show={modal} dismiss={() => setModal(false)} confirm={addURL} />
        <Text style={{ fontSize: 18 }}><Text style={{ color: Colors.accent, fontSize: 18 }}>Audio</Text>Books</Text>
        <Button dark transparent onPress={() => setModal(true)}>
          <FeatherIcon name="plus" />
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
      <Content style={{ backgroundColor: '#f1f5f8', flex: 1  }}>
        {
          books?.map(book => <BookCard key={book.id} _book={book}/>)
        }
        { bookParser.isProcessing && <Spinner/> }
      </Content>
      <MiniPlayerSheet/>
      <View style={{ height: BOTTOM_BAR_HEIGHT, width: '100%', backgroundColor: 'white', elevation: 10, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <BorderlessButton style={style.button}>
          <FeatherIcon name="home" size={24}/>
        </BorderlessButton>
        <BorderlessButton style={style.button}>
          <FeatherIcon name="layers" size={24}/>
        </BorderlessButton>
        <BorderlessButton style={style.button}>
          <FeatherIcon name="menu" size={24}/>
        </BorderlessButton>
      </View>
    </Container>
    <PlayerSheet/>
    {/*<Player/>*/}
  </>
};

const style = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
