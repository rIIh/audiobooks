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
      chapters.push({ title, downloadUrl: JSON.stringify(audio.src), duration });
    }

    const thumbnail = document.querySelector('.cover__wrapper--image > img').src.replace('42x.jpg', '400x.jpg');
    const result = { title, author, thumbnail, chapters }; // собрали в структуру название книги и данные глав
    const json = JSON.stringify(result);
    const playerBottom = document.getElementsByClassName('book--bottom')[0]; // взяли элемент под списком воспроизведения
    playerBottom.innerHTML = ''; // убрали из него прежние данные (в том числе переключатель "По главам")
    const el = document.createElement('textarea'); // создали элемент, из которого можно копировать длинный текст
    el.value = json;
    el.contentEditable = 'true';
    el.readOnly = true;
    playerBottom.appendChild(el); // добавили его под список треков

    window.flutter_inappwebview.callHandler('success', JSON.stringify(result));
  }
  catch (e) {
    window.flutter_inappwebview.callHandler('failed', e.message);
  }