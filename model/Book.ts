import { Model, Query } from '@nozbe/watermelondb';
import { children, field } from '@nozbe/watermelondb/decorators';
import Chapter from './Chapter';
import FilePath from './FilePath';
import {useDatabase} from "@nozbe/watermelondb/hooks";

export default class Book extends Model {
  static table = 'books';
  static associations = {
    chapters: { type: 'has_many' as 'has_many', foreignKey: 'book_id' },
    files: { type: 'has_many' as 'has_many', foreignKey: 'book_id' },
  };
  static useCollection = () => useDatabase().collections.get<Book>(Book.table);

  @field('title') title!: string;
  @field('author') author!: string;
  @field('thumbnail') thumbnail!: string;
  @children('chapters') chapters!: Query<Chapter>;
  @children('files') files!: Query<FilePath>;
}
