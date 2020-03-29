export function fetchBook() {
  try {
    const playlistItems = [
      ...document.getElementsByClassName('chapter__default'),
    ]; // нашли на странице список треков
    // const bookTitle = document.title.replace(' - слушать аудиокнигу онлайн', ''); // взяли название страницы для того, чтобы использовать в качестве названия книги
    const title = document
      .querySelector('.caption__article-title')
      .firstChild.wholeText.replace(/(\r\n|\n|\r)/gm, '')
      .trim(); // взяли название страницы для того, чтобы использовать в качестве названия книги
    const author = document
      .querySelector('.caption__article-author')
      .firstChild.wholeText.replace(/(\r\n|\n|\r)/gm, '')
      .trim(); // взяли название страницы для того, чтобы использовать в качестве названия книги

    const chapters = []; // здесь будем накапливать данные глав (название файла и url для загрузки)
    const min = 0; // можно указать значение больше 0 для пропуска первых min глав
    let i = 0;
    const max = 1000; // можно указать другое значение для пропуска глав после max

    for (let ind = 0; ind < playlistItems.length; ind++) {
      let item = playlistItems[ind];
      if (item.clientHeight === 0 || ind < min || ind > max) {
        continue;
      } // пропускаем первую половину списка

      const chapterTitle = item.getElementsByClassName(
        'chapter__default--title',
      )[0].firstChild.wholeText;

      item.click();

      const audio = document
        .getElementsByClassName('plyr')[0]
        .getElementsByTagName('audio')[0]; // в этом элементе есть название трека и url для загрузки
      chapters.push({ chapterTitle, url: JSON.stringify(audio.src) });
    }

    // for (let item of playlistItems) {
    //   if (item.clientHeight === 0 || i < min || i > max) {
    //     continue;
    //   } // пропускаем первую половину списка
    //
    //   const chapterTitle = item.getElementsByClassName(
    //     'chapter__default--title',
    //   )[0].firstChild.wholeText;
    //
    //   item.click();
    //
    //   const audio = document
    //     .getElementsByClassName('plyr')[0]
    //     .getElementsByTagName('audio')[0]; // в этом элементе есть название трека и url для загрузки
    //   chapters.push({ chapterTitle, url: JSON.stringify(audio.src) });
    //   i++;
    // }

    const result = { title, author, chapters }; // собрали в структуру название книги и данные глав
    const json = JSON.stringify(result);

    // @ts-ignore
    window.ReactNativeWebView.postMessage(json);
  } catch (e) {
    window.ReactNativeWebView.postMessage(e.message);
  }
}

export const injectableBookParser = `${fetchBook.toString()}();`;
