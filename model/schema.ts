import { appSchema, tableSchema } from '@nozbe/watermelondb';
import Book from './Book';
import Chapter from './Chapter';
import FilePath from './FilePath';

export default appSchema({
  version: 4,
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
        { name: 'duration', type: 'number' },
        { name: 'download_url', type: 'string' },
        { name: 'complete', type: 'boolean' },
        { name: 'progress', type: 'number' },
      ],
    }),
    tableSchema({
      name: FilePath.table,
      columns: [
        { name: 'book_id', type: 'string' },
        { name: 'path', type: 'string' },
        { name: 'url', type: 'string' },
        { name: 'remote_size', type: 'number', isOptional: true },
      ],
    }),
  ],
});
