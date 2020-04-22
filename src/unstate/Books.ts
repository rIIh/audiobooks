import Book from '../../model/Book';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { useObservable } from 'rxjs-hooks';
import { createContainer } from 'unstated-next';

export interface Books {
  data: {
    books: Books[];
  };
}

const useBooks = () => {
  const database = useDatabase();
  const booksCollection = database.collections.get<Book>(Book.table);
  const books = useObservable(() => booksCollection.query().observe());

  return {
    books,
  };
};

export const Books = createContainer(useBooks);
