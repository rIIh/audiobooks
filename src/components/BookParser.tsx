import React, { useCallback, useContext, useState } from 'react';
import WebView from 'react-native-webview';
import { Map } from 'immutable';
import { noop } from '../../lib/noop';
import Chapter from '../../model/Chapter';
import Book from '../../model/Book';

interface IBookParser {
  parseBook: (url: string) => Promise<BookObject>;
  isProcessing: boolean;
}

const BookParserContext = React.createContext<IBookParser>({
  parseBook: noop,
  isProcessing: false,
});

interface Response<T> {
  failed: boolean;
  message?: string;
  data?: T;
}

export interface BookObject extends Pick<Book, 'title' | 'author' | 'thumbnail'> {
  chapters: (Pick<Chapter, 'title' | 'downloadURL'> & { duration: string })[];
}

export const URLConstraints = {
  domains: ['akniga'],
  zones: ['org'],
  prefix: '.*',
  get regex() {
    return new RegExp(`https:\\/\\/${this.prefix}(${this.domains.join('|')})\\.(${this.zones.join('|')})\\/.*`);
  },
};

export const BookParser: React.FC = ({ children }) => {
  const [resolvers, setResolvers] = useState<
    Map<string, { resolve: (book: BookObject) => void; reject: (error: Error) => void }>
  >(Map());
  const parseBook = useCallback(
    (url: string) => {
      return new Promise<BookObject>((resolve, reject) => {
        console.log(URLConstraints.regex, URLConstraints.regex.test(url), url);
        if (URLConstraints.regex.test(url)) {
          setResolvers(last => last.set(url, { resolve, reject }));
        } else {
          reject('Wrong URL. It should belong to akniga.org');
        }
      });
    },
    [setResolvers],
  );
  const bookReady = useCallback(
    (url: string, book?: BookObject, error?: Error) => {
      if (book) {
        resolvers.get(url)!.resolve(book);
      } else if (error) {
        resolvers.get(url)!.reject(error);
      }
      setResolvers(last => last.remove(url));
    },
    [resolvers],
  );
  return (
    <BookParserContext.Provider
      value={{
        parseBook,
        isProcessing: resolvers.size > 0,
      }}>
      {[...resolvers.keys()].map(key => (
        <WebView
          key={key}
          containerStyle={{ display: 'none' }}
          source={{
            uri: key,
          }}
          injectedJavaScript={js}
          onMessage={event => {
            const response = JSON.parse(event.nativeEvent.data) as Response<BookObject>;
            bookReady(key, response.data, response.message ? new Error(response.message) : undefined);
          }}
        />
      ))}
      {children}
    </BookParserContext.Provider>
  );
};

const js = `
  try {
    const gotPlayer = document.getElementsByClassName('plyr')[0]; // нашли на странице плеер
    const playlistItems = [...document.getElementsByClassName('chapter__default')]; // нашли на странице список треков
    // const bookTitle = document.title.replace(' - слушать аудиокнигу онлайн', ''); // взяли название страницы для того, чтобы использовать в качестве названия книги
    const title = document.querySelector('.caption__article-title').firstChild.wholeText.replace(/(\\r\\n|\\n|\\r)/gm,"").trim(); // взяли название страницы для того, чтобы использовать в качестве названия книги
    const author = document.querySelector('.caption__article-author').firstChild.wholeText.replace(/(\\r\\n|\\n|\\r)/gm,"").trim(); // взяли название страницы для того, чтобы использовать в качестве названия книги

    const chapters = []; // здесь будем накапливать данные глав (название файла и url для загрузки)
    const min = 0; // можно указать значение больше 0 для пропуска первых min глав
    let i = 0;
    const max = 1000; // можно указать другое значение для пропуска глав после max

    for (let item of playlistItems) {
      i++;

      if (item.clientHeight === 0) {
        continue;
      } // пропускаем первую половину списка
      //
      if (i < min) {
        continue;
      }
      if (i > max) {
        continue;
      }
      const title = item.getElementsByClassName('chapter__default--title')[0].firstChild.data;

      item.click();
      // item.dispatchEvent(click);

      const audio = document.getElementsByClassName('plyr')[0].getElementsByTagName('audio')[0]; // в этом элементе есть название трека и url для загрузки
      const duration = item.getElementsByClassName('chapter__default--time')[0].lastChild.data;
      chapters.push({ title, downloadURL: JSON.stringify(audio.src), duration });
    }
    
    const thumbnail = document.querySelector('.cover__wrapper--image > img').src;

    const result = { title, author, thumbnail, chapters }; // собрали в структуру название книги и данные глав

    const json = JSON.stringify(result);

    const playerBottom = document.getElementsByClassName('book--bottom')[0]; // взяли элемент под списком воспроизведения
    playerBottom.innerHTML = ''; // убрали из него прежние данные (в том числе переключатель "По главам")

    const el = document.createElement('textarea'); // создали элемент, из которого можно копировать длинный текст
    el.value = json;

    el.contentEditable = 'true';
    el.readOnly = true;

    playerBottom.appendChild(el); // добавили его под список треков

    // @ts-ignore
    window.ReactNativeWebView.postMessage(JSON.stringify({
      failed: false,
      data: result
    }));
  }
  catch (e) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      failed: true,
      message: e.message,
    }));
  }
`;

export const useBookParser = () => useContext(BookParserContext);
