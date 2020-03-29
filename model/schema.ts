import { appSchema, tableSchema } from '@nozbe/watermelondb';
import Book from './Book';
import Chapter from './Chapter';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: Book.table,
      columns: [
        { name: 'title', type: 'string' },
        { name: 'author', type: 'string', isOptional: true },
        { name: 'thumbnail', type: 'string' },
      ],
    }),
    tableSchema({
      name: Chapter.table,
      columns: [
        { name: 'index', type: 'number' },
        { name: 'book_id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'download_url', type: 'string' },
      ],
    }),
  ],
});
