import WebView from 'react-native-webview';
import React, {useEffect, useState} from 'react';

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
      chapters.push({ title, downloadURL: JSON.stringify(audio.src) });
    }

    const result = { title, author, chapters }; // собрали в структуру название книги и данные глав

    const json = JSON.stringify(result);

    const playerBottom = document.getElementsByClassName('book--bottom')[0]; // взяли элемент под списком воспроизведения
    playerBottom.innerHTML = ''; // убрали из него прежние данные (в том числе переключатель "По главам")

    const el = document.createElement('textarea'); // создали элемент, из которого можно копировать длинный текст
    el.value = json;

    el.contentEditable = 'true';
    el.readOnly = true;

    playerBottom.appendChild(el); // добавили его под список треков

    // @ts-ignore
    window.ReactNativeWebView.postMessage(json);
  }
  catch (e) {
    window.ReactNativeWebView.postMessage(e.message);
  }
`;

export interface Book {
  title: string;
  author: string;
  thumbnail: string;
  chapters: {
    title: string;
    downloadURL: string;
  }
}

interface Props {
  url: string;
  onReady?: (data: Book) => void;
}

export const ParseBook: React.FC<Props> = ({ url, onReady }) => {
  const [state, setState] = useState<Book | null>(null);
  useEffect(() => setState(null), [url]);

  return state == null ? <WebView
      containerStyle={{ width: 0, height: 0, display: 'none' }}
      source={{
        uri: url,
      }}
      injectedJavaScript={js}
      onMessage={event => {
        console.log(event.nativeEvent.data)
        const value = JSON.parse(event.nativeEvent.data) as Book;
        setState(value);
        onReady?.(value);
      }}
    /> : null;
};
